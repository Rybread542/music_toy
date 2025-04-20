import json
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
        logger.info(f'RUNNING QUERY:\n{query} WITH ARGS \n {args}')
        cursor.execute(query, args)
        data = cursor.fetchall()
        logger.info(f'DATA FOR THIS DB CALL: {data}')
        return data
    
    except Exception as e:
        logger.error(f'ERROR WHEN RUNNING QUERY: {e}')
        return None


def build_ann_query(output_type, input_artist_id, input_date_range, input_pop_val):
    ef_search = 100 + (input_pop_val * 5)
    artist_cutoff = 500000 + (input_pop_val*10000)
    date_start, date_end = input_date_range

    if output_type == 'track':
        limit = 100 + (input_pop_val * 5)
        ef_set = f'SET ivfflat.probes = {ef_search / 5}; \n'
    
    else:
        limit = 10 + input_pop_val
        ef_set = f'SET hnsw.ef_search = {ef_search}; \n'

    if output_type == 'artist':
        ann_select = f"""
            WITH ann_matches AS (
                SELECT
                    art.id,
                    embed.embed <-> %s dist

                FROM
                    artist_embedding embed

                LEFT JOIN artist art
                ON art.id = embed.artist_id

                WHERE
                    art.id != 1
                    AND art.id != {input_artist_id}

                ORDER BY dist
                LIMIT {limit})
                
            SELECT
                art.name,
                art.cleaned_tags
            
            FROM 
                ann_matches ann
                
            LEFT JOIN artist art
            ON ann.id = art.id
            
            ORDER BY ann.dist;"""

    if output_type == 'album':
        ann_select = f"""
            WITH ann_matches AS (
                SELECT
                    alb.id,
                    embed.embed <-> %s dist
                
                FROM
                    album_embedding embed
                
                LEFT JOIN album alb
                ON alb.id = embed.album_id

                LEFT JOIN artist_credit ac
                ON alb.artist_credit = ac.id

                LEFT JOIN artist art
                ON ac.artist_id = art.id

                WHERE art.id != 1
                AND art.id != {input_artist_id}
                AND art.id <= {artist_cutoff}
                AND alb.release_year BETWEEN {date_start} AND {date_end}
                AND 'Single' <> ALL(alb.release_type)
                AND 'Compilation' <> ALL(alb.release_type)

                ORDER BY dist

                LIMIT {limit})
                
            SELECT
                alb.title,
                art.name,
                alb.release_year,
                alb.cleaned_tags,
                alb.gid
                
            FROM ann_matches ann
            
            LEFT JOIN album alb
            ON alb.id = ann.id
            
            LEFT JOIN artist_credit ac
            ON ac.id = alb.artist_credit
            
            LEFT JOIN artist art
            ON art.id = ac.artist_id
            
            ORDER BY ann.dist;"""
        

    if output_type == 'track':
        

        ann_select = f"""
            WITH ann_matches AS (
                SELECT
                    tr.id,
                    tr.title,
                    embed.embed <-> %s dist
                
                FROM
                    track_embedding embed
                
                JOIN track tr
                ON tr.id = embed.track_id

                JOIN artist_credit ac
                ON ac.id = tr.artist_credit

                JOIN artist art
                ON ac.artist_id = art.id

                JOIN album_variations av
                ON tr.album_id = av.id

                JOIN album alb
                ON av.album_group = alb.id

                WHERE art.id != 1
                AND art.id != {input_artist_id}
                AND art.id <= {artist_cutoff}
                AND tr.duration > 90000
                AND alb.release_year BETWEEN {date_start} AND {date_end}
                AND 'Single' <> ALL(alb.release_type)
                AND 'Compilation' <> ALL(alb.release_type)

                order by dist

                LIMIT {limit}),

            ranked AS (
            SELECT *,
            row_number() OVER (PARTITION BY title ORDER BY dist) AS rn
            FROM ann_matches
            )
                
            SELECT
                tr.title,
                art.name,
                alb.release_year,
                alb.cleaned_tags,
                alb.gid
                
            FROM ranked ann

            JOIN track tr
            ON tr.id = ann.id

            JOIN artist_credit ac
            ON ac.id = tr.artist_credit
            
            JOIN artist art
            ON art.id = ac.artist_id

            JOIN album_variations av
            ON tr.album_id = av.id
            
            JOIN album alb
            ON av.album_group = alb.id

            WHERE ann.rn = 1
            ORDER BY ann.dist;"""

    

    return (ef_set + ann_select)

