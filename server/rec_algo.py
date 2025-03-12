import os
import sys
import json
from dotenv import load_dotenv
from algo_utils.ai_tools import chatbot_get, create_embedding
from algo_utils.mblite_db import db_execute_stmt
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
        return artist_id, cleaned_tags
    
    else:
        ai_tags = chatbot_get(system_prompt=os.getenv('AI_GET_TAGS_SYSPROMPT'), 
                              user_prompt=
                              f'Type: {input_type} Artist: {artist}' + 
                              (f' Title: {title}') if input_type != 'artist' else (''))
        return artist_id, ai_tags


# generate vector embedding of tags for ANN comparison
# return: numpy array -> string
def get_input_embed(tags):
    return create_embedding(tags)    

def get_ai_query_mod(comment, query):
    pass

def process_recc(output_type, input_embed, artist_id, comment):
    query = os.getenv(f'SELECT_ANN_{output_type.upper()}')

    if comment:
        query = get_ai_query_mod(comment, query)

    recc_data = db_execute_stmt(query, (input_embed, artist_id))

    return recc_data


def recommend(input_data):
    input_type = input_data['input_type']
    output_type = input_data['output_type']
    input_title = input_data['input_title']
    input_artist = input_data['input_artist']
    input_comment = input_data['input_comment']

    # get artist id to filter from results, and genre tags
    # print('getting input tags...')

    input_artist_id, tags_string = get_input_tags(input_type, input_title, input_artist)

    # print('artist id: ', input_artist_id)
    # print(f'input tags: {tags_string}')

    # generate vector embed
    # print('generating embed...')

    tags_embed = get_input_embed(tags_string)

    # print(tags_embed)
    # print('done')

    result = process_recc(output_type, tags_embed, input_artist_id, input_comment)
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
    sample_input = {
    'input_type' : 'artist',
    'output_type' : 'album',
    'input_title' : '',
    'input_artist' : 'Car Seat Headrest',
    'input_comment' : ''
    }
    result = recommend(input_data)
    print(json.dumps(result))

