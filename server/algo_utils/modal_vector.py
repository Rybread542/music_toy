import modal

app = modal.App(name='embed')

sent_trans_image = modal.Image.debian_slim(python_version='3.12').run_commands(
    "apt-get update",
    "pip install -U sentence-transformers",
    "pip install torch"
)

@app.function(image=sent_trans_image, gpu='any', enable_memory_snapshot=True)

def sentence_embedding(embed_str):
    from sentence_transformers import SentenceTransformer
    embed_model = SentenceTransformer("all-mpnet-base-v2", device='cuda')
    embed = embed_model.encode(embed_str, convert_to_tensor=False, normalize_embeddings=False)
    embed_string = "[" + ', '.join(str(x) for x in embed) + "]"
    return embed_string

@app.local_entrypoint()
def main(string):
    embed_str = sentence_embedding.remote(string)
    print(embed_str)