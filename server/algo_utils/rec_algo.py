import os
import sys
import json
from dotenv import load_dotenv
from ai_tools import chatbot_get, create_embedding
from mblite_db import db_execute_stmt
import random

load_dotenv()



# Gets a list of descriptor tags from the database
# In the case the database has no tags for the input, sends to chatbot for 
# hopefully, decent descriptor generation
# return: [string]
def get_input_tags(input_type, title, artist):
    
    # Get tag query and set args
    query = os.getenv(f'SELECT_{input_type.upper()}_TAGS')
    query_args = (artist,) if input_type == 'artist' else (artist, title)

    # Get db tags
    db_tag_data = db_execute_stmt(query, query_args)
    artist_id, tags_output = db_tag_data[0]

    if tags_output:
        # Send tags to chatbot for cleanup (removing tags which compromise the ANN search)
        cleaned_tags = chatbot_get(system_prompt=os.getenv('AI_CLEAN_TAGS_SYSPROMPT'), user_prompt=tags_output)
        print(cleaned_tags, file=sys.stderr)
        return artist_id, cleaned_tags
    
    else:
        ai_tags = chatbot_get(system_prompt=os.getenv('AI_GET_TAGS_SYSPROMPT'), 
                              user_prompt=
                              f'Type: {input_type} Artist: {artist}' + 
                              (f' Title: {title}') if input_type != 'artist' else (''))
        return artist_id, ai_tags


# Updates the SQL query and list of genre tags depending on user comment
# Uses chatbot for interpretation, so nonzero risk of breaking the entire search
# return: query string, tags list string
def ai_search_mod(query, tags, comment):

    # format to string dict AI is expecting
    user_input = f'{{"query" : {query}, "tags" : {tags}, "comment" : {comment}}}'

    # output
    ai_output = chatbot_get(system_prompt=os.getenv('AI_MODIFY_QUERY_SYSPROMPT'),
                            user_prompt = user_input)
    
    # convert to dict and destructure
    print(ai_output, file=sys.stderr)
    output_dict = json.loads(ai_output)

    query = output_dict['query']
    tags = "[" + ', '.join(str(x) for x in output_dict['tags']) + "]"

    return query, tags


# generate vector embedding of tags for ANN comparison
# return: numpy array string
def get_input_embed(tags):
    return create_embedding(tags)    


def process_recc(query, input_embed, artist_id):

    recc_data = db_execute_stmt(query, (input_embed, artist_id))

    return recc_data


def recommend(input_data):
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

    if input_comment:
        query, tags_string = ai_search_mod(query, tags_string, input_comment)


    tags_embed = get_input_embed(tags_string)

    result = process_recc(query, tags_embed, input_artist_id)
    random.shuffle(result)

    results_list = []

    for item in result[:3]:
        if output_type == 'artist':
            results_list.append({
                'outputType' : f'{output_type}',
                'outputArtist' : f'{item[1]}'
            })
        else:
            results_list.append({
                'outputType' : f'{output_type}',
                'outputArtist' : f'{item[1]}',
                'outputTitle' : f'{item[0]}'
            })

    return results_list











if __name__ == '__main__':
    input_data = json.loads(sys.argv[1:][0])
    result = recommend(input_data)
    print(json.dumps(result))

