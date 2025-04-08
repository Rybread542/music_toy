import psycopg2
import os
import sys
from dotenv import load_dotenv
from logging_config import logger

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME= os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')

db_conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASS
)

def get_db_cursor():
    return db_conn.cursor()

def db_execute_stmt(query: str, args: tuple):
    cursor = get_db_cursor()
    try:
        cursor.execute(query, args)
        data = cursor.fetchall()
        logger.info(f'DATA FOR THIS DB CALL: {data}')
        return data
    
    except SyntaxError:
        return


def build_ann_query(output_type, input_artist_id, input_date_range, input_pop_val):
    ef_search = 500 + (input_pop_val * 5)
    artist_cutoff = 500000 + (input_pop_val*10000)
    limit = 10 + input_pop_val
    date_start, date_end = input_date_range

    ef_set = f'SET hnsw.ef_search = {ef_search}; \n'

    ann_table = f"""
    WITH ann_matches AS (
        SELECT
            embed.{output_type}_id
        FROM
            {output_type}_embedding embed
        ORDER BY
            embed.embed <-> %s
        LIMIT {limit}
    ) 
        """
    
    if output_type == 'artist':
        query_main = f"""
            SELECT
                art.name,
                art.cleaned_tags
                
            FROM ann_matches ann
            
            LEFT JOIN artist art
            ON ann.artist_id = art.id
            
            WHERE art.id != {input_artist_id}
            AND art.id <= {artist_cutoff};"""
        
    if output_type == 'album':
        query_main = f"""
            SELECT
                alb.title,
                art.name,
                alb.release_year,
                alb.cleaned_tags,
                alb.gid

            FROM ann_matches ann

            LEFT JOIN album alb
            ON ann.album_id = alb.id

            LEFT JOIN artist_credit ac
            ON alb.artist_credit = ac.id

            LEFT JOIN artist art 
            ON ac.artist_id = art.id

            WHERE art.id != 1
            AND art.id != {input_artist_id}
            AND art.id <= {artist_cutoff}
            AND alb.release_year BETWEEN {date_start} AND {date_end}
            AND 'Single' <> ALL(alb.release_type)
            AND 'Compilation' <> ALL(alb.release_type);
                """
        
    if output_type == 'track':
        query_main = f"""
            SELECT
                tr.title,
                art.name,
                alb.release_year,
                tr.cleaned_tags,
                alb.gid

            FROM ann_matches ann

            JOIN track tr
            ON ann.track_id = tr.id

            JOIN artist_credit ac
            ON tr.artist_credit = ac.id

            JOIN artist art
            ON art.id = ac.artist_id

            JOIN album_variations av
            ON tr.album_id = av.id

            JOIN album alb
            ON av.album_group = alb.id
            
            WHERE art.id != {input_artist_id}
            AND art.id <= {artist_cutoff}
            AND tr.duration > 90000
            AND alb.release_year BETWEEN {date_start} AND {date_end}
            AND 'Single' <> ALL(alb.release_type)
            AND 'Compilation' <> ALL(alb.release_type);
            """

    return (ef_set + ann_table + query_main)

