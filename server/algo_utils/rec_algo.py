import os
import sys
import json
from dotenv import load_dotenv
from ai_tools import chatbot_get, create_embedding
from mblite_db import db_execute_stmt
import random
from logging_config import logger

load_dotenv()

# Gets a list of descriptor tags from the database
# In the case the database has no tags for the input, sends to chatbot for 
# hopefully, decent descriptor generation
# return: [string]
def get_input_tags(input_type: str, title: str, artist: str):
    
    try:
        # Get tag query and set args
        query = os.getenv(f'SELECT_{input_type.upper()}_TAGS')
        query_args = (artist,) if input_type == 'artist' else (artist, title)

        # Get db tags
        db_tag_data = db_execute_stmt(query, query_args)
        if not db_tag_data:
            return json.loads(os.getenv('ERROR_EMPTY_DB_RESULT')), ''
        

        artist_id, tags_output = db_tag_data[0]
        
        if tags_output:
            # Send tags to chatbot for cleanup (removing tags which compromise the ANN search)
            ai_output = chatbot_get(system_prompt=os.getenv('AI_CLEAN_TAGS_SYSPROMPT'),
                            user_prompt = str(tags_output))
    
            return artist_id, ai_output
        
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
# return: query string, tags list string
def ai_search_mod(query: str, tags: str, comment: str):

    # format to string dict AI is expecting
    user_input = f'{{"query" : {query}, "tags" : {tags}, "comment" : {comment}}}'

    # output
    ai_output = chatbot_get(system_prompt=os.getenv('AI_MODIFY_QUERY_SYSPROMPT'),
                            user_prompt = user_input)
    
    # convert to dict and destructure
    try:
        output_dict = json.loads(ai_output)
        query = output_dict['query']
        tags = output_dict['tags']
    
    except json.JSONDecodeError as e:
        return json.loads(os.getenv('ERROR_JSON_PARSER')), ''

    return query, tags


# generate vector embedding of tags for ANN comparison
# return: numpy array string
def get_input_embed(tags: str):
    return create_embedding(tags)    


def recommend(input_data: dict):
    # Destructure 
    input_type = input_data['input_type']
    output_type = input_data['output_type']
    input_title = input_data['input_title']
    input_artist = input_data['input_artist']
    input_comment = input_data['input_comment']

    # Grab ANN output query
    query = os.getenv(f'SELECT_ANN_{output_type.upper()}')


    # get artist id to filter from results, and genre tags
    input_artist_id, tags_string = get_input_tags(input_type, input_title, input_artist)
    logger.info(f'Initial tags from DB: {tags_string}')

    # if it's a dict then it's an error, return
    if isinstance(input_artist_id, dict):
        logger.error(f'EMPTY QUERY RETURNING ERROR TO CLIENT')
        return input_artist_id


    # send query and tags to chatbot if there is a user comment
    if input_comment:

        logger.info(f'Sending query/tags to AI for mods')

        query, tags_string = ai_search_mod(query, tags_string, input_comment)

        logger.info(f'AI returned query: {query}')
        logger.info(f'AI returned tags: {tags_string}')

        # if it's a dict then it's an error, return
        if isinstance(query, dict):
            logger.error('RETURNING ERROR TO CLIENT AFTER AI MOD')
            return query


    # convert finalized set of tags to a vector embedding
    tags_embed = get_input_embed(tags_string)

    # query db with embedding and artist ID to filter
    result = db_execute_stmt(query, (tags_embed, input_artist_id))

    # shuffle results for pseudo variety
    random.shuffle(result)

    # pick 3, create list of objects, and return
    results_list = []

    for item in result[:3]:
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
                'outputGenres' : f'{item[3]}'
            })

    logger.info(f'FINAL RESULTS: {results_list}')
    return results_list











if __name__ == '__main__':
    input_data = json.loads(sys.argv[1:][0])
    logger.info(f'INPUT DATA FOR PY ALGO: {input_data}')
    result = recommend(input_data)
    print(json.dumps(result))

