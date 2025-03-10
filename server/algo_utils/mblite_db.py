import psycopg2
import os
from dotenv import load_dotenv

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

def db_execute_stmt(query, args):
    cursor = get_db_cursor()
    try:
        cursor.execute(query, args)
        data = cursor.fetchall()
        print('data for this db call:')
        print(data)
        return data
    
    except SyntaxError:
        print('SYNTAX ERROR ON EXECUTION')

