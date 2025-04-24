import os
from dotenv import load_dotenv
from openai import OpenAI
import subprocess
from logging_config import logger

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)


# Grab one stateless ChatGPT 4o response with a sysprompt
def chatbot_get(system_prompt: str, user_prompt: str):
    response = client.chat.completions.create(
    model='chatgpt-4o-latest',
    messages=[
        {'role' : 'system', 'content' : system_prompt},

        {'role' : 'user',
         'content' : user_prompt}
    ])

    logger.info(f'Chatbot response: {response}')
    return response.choices[0].message.content

# Turn a string array of tags into a vector embedding of length 768
# Utilizes modal service for GPU
def create_embedding(embed_string: str):
    process_result = subprocess.run(['/home/vvb/web-app/myx/music_toy/server/bin/modal', 'run', '-q', './algo_utils/modal_vector.py', '--string', embed_string], capture_output=True, text=True).stdout
    return process_result