import os
from dotenv import load_dotenv
from openai import OpenAI
from sentence_transformers import SentenceTransformer

load_dotenv()

OPENAI_KEY = os.getenv('OPENAI_KEY')
client = OpenAI(api_key=OPENAI_KEY)

def chatbot_get(system_prompt, user_prompt):
    response = client.chat.completions.create(
    model='chatgpt-4o-latest',
    messages=[
        {'role' : 'system', 'content' : system_prompt},

        {'role' : 'user',
         'content' : user_prompt}
    ])
    return response.choices[0].message.content

def create_embedding(embed_string):
    embed_model = SentenceTransformer("all-mpnet-base-v2", device='cpu')
    embed = embed_model.encode(embed_string, convert_to_tensor=False, normalize_embeddings=True)
    embed_string = "[" + ', '.join(str(x) for x in embed) + "]"
    return embed_string