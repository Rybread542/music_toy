import os
import sys
import json
from dotenv import load_dotenv
from ai_tools import chatbot_get, create_embedding
from mblite_db import db_execute_stmt, build_ann_query
import random
from logging_config import logger

load_dotenv()

# Gets a list of descriptor tags from the database
# In the case the database has no tags for the input, sends to chatbot for 
# hopefully, decent descriptor generation
def get_input_tags(input_type: str, title: str, artist: str):
    
    try:
        # Get tag query and set args
        query = os.getenv(f'SELECT_{input_type.upper()}_TAGS')
        query_args = (artist,) if input_type == 'artist' else (artist, title)


        # Query db for tags, and send an error back to client on empty result set
        db_tag_data = db_execute_stmt(query, query_args)
        if not db_tag_data:
            return json.loads(os.getenv('ERROR_EMPTY_DB_RESULT')), ''
        


        logger.info(f'Tag data: {db_tag_data[0]}')
        artist_id, tags_output = db_tag_data[0]

        if tags_output:
            return artist_id, tags_output
        


        # Many artists, albums, etc have the potential of simply not having tags,
        # OR the database returned a duplicate/different version in the case
        # of album/track which does not have tags entered.

        # in this case, we can use ChatGPT as a fallback;
        # send the info to the chatbot, and pray for accurate tags

        # Prone to hallucination if training data for an input is lacking,
        # but in the spirit of discovery, I prefer some music be sent back to the user
        # versus nothing
        else:
            prompt = f'Type: {input_type} Artist: {artist}' + (f' Title: {title}' if input_type != 'artist' else '')

            ai_tags = chatbot_get(system_prompt=os.getenv('AI_GET_TAGS_SYSPROMPT'), 
                                user_prompt = prompt)
            
            logger.info(f'AI GENERATED TAGS: {ai_tags}')
            return artist_id, ai_tags
        

    
    except IndexError as e:
        return json.loads(os.getenv('ERROR_INDEX_GET_TAGS')), ''
    
    except Exception as e:
        return json.loads(os.getenv('ERROR_UNKNOWN')), ''




# Updates the SQL query and list of genre tags depending on user comment
# Uses chatbot for interpretation, so nonzero risk of breaking the entire search
def ai_search_mod(query: str, tags: str, comment: str):

    # format to string dict AI is expecting
    user_input = f'{{"query" : {query}, "tags" : {tags}, "comment" : {comment}}}'

    ai_output = chatbot_get(system_prompt=os.getenv('AI_MODIFY_QUERY_SYSPROMPT'),
                            user_prompt = user_input)
    

    # convert to dict and destructure
    try:
        output_dict = json.loads(ai_output)
        query = output_dict['query']
        tags = output_dict['tags']

    
    # we can attempt to catch the AI breaking and send and error to the client,
    # assuming that json errors indicate the AI ignored the prompt due to user manipulation
    except json.JSONDecodeError as e:
        return json.loads(os.getenv('ERROR_JSON_PARSER')), ''

    return query, tags


# generate vector embedding of tags for ANN comparison
def get_input_embed(tags: str):
    return create_embedding(tags)    


def recommend(input_data: dict):
    # Destructure 
    input_type = input_data['input_type']
    output_type = input_data['output_type']
    input_title = input_data['input_title']
    input_artist = input_data['input_artist']
    input_comment = input_data['input_comment']
    input_date_range = input_data['input_date_range']
    input_pop_val = input_data['input_pop_val']

    # get artist id to filter from results, and genre tags
    input_artist_id, tags_string = get_input_tags(input_type, 
                                                  input_title, 
                                                  input_artist)
    

    # if it's a dict then it's an error, return to client
    if isinstance(input_artist_id, dict):
        logger.error(f'EMPTY QUERY RETURNING ERROR TO CLIENT')
        return input_artist_id
    

    query = build_ann_query(output_type, 
                            input_artist_id, 
                            input_date_range, 
                            input_pop_val)
    

    # send query and tags to chatbot if there is a user comment
    if input_comment:

        query, tags_string = ai_search_mod(query, tags_string, input_comment)

        logger.info(f'AI returned query: {query}')
        logger.info(f'AI returned tags: {tags_string}')

        # if it's a dict then it's an error, return to client
        if isinstance(query, dict):
            logger.error('RETURNING ERROR TO CLIENT AFTER AI MOD')
            return query


    # convert finalized set of tags to a vector embedding
    if isinstance(tags_string, list):
        tags_string = str(tags_string)
        
    tags_embed = get_input_embed(tags_string)

   
    # query db with embedding and artist ID to filter
    result = db_execute_stmt(query, (tags_embed,))

    if not result:
        return json.loads(os.getenv('ERROR_ANN_QUERY_FAIL'))
    


    # shuffle results for pseudo variety
    # TODO: This could use more fleshing out
    # Potentially send top N to chatbot and have it pick, 
    # Or utilize the variety value input by user to select 
    # a narrower or wider chunk of the total results
    random.shuffle(result)

    # pick 3, create list of objects, and return
    results_list = []
    artList = []
    while (len(results_list) < 3):

        if (len(result) > 0):
            item = result.pop()

        else:
            break
        
        # Prevent more than one result by the same artist
        artist = item[1] if output_type != 'artist' else item[0]
        if artist not in artList: 
            artList.append(artist)

            # return based on type
            if output_type == 'artist':
                results_list.append({
                    'outputType' : f'{output_type}',
                    'outputArtist' : f'{item[0]}',
                    'outputGenres' : f'{item[1]}'
                })

            else:
                results_list.append({
                    'outputType' : f'{output_type}',
                    'outputArtist' : f'{item[1]}',
                    'outputTitle' : f'{item[0]}',
                    'outputYear' : f'{item[2]}',
                    'outputGenres' : f'{item[3]}',
                    'outputMBID' : f'{item[4]}'
                })

    logger.info(f'FINAL RESULTS: {results_list}')
    return results_list






if __name__ == '__main__':
    input_data = json.loads(sys.argv[1:][0])
    logger.info(f'INPUT DATA FOR PY ALGO: {input_data}')
    result = recommend(input_data)
    print(json.dumps(result))

