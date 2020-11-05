import time
import datetime

import utils
from db.auth import DB_HOST, DB_USERNAME, DB_PASSWORD

import mysql.connector


base_code = "def main(text: str) -> None:\n    print(text)\n\nif __name__ == '__main__':\n    main('Hello World !')"


conn = mysql.connector.connect(
  host=DB_HOST,
  user=DB_USERNAME,
  password=DB_PASSWORD,
  database='codewe'
)



def get_document(doc_id):
    """Get doc in the databse with id specified

    Args:
        doc_id (int): id of the doc to modify

    Returns:
        tuple: all values with the document
    """
    query = "SELECT * FROM documents WHERE document_id = %s"
    c = conn.cursor(dictionary=True)
    c.execute(query, (doc_id,))
    return c.fetchone()


def update_document(doc_id, text_content):
    """Update the document in the db with the id specified

    Args:
        doc_id (int): id of the document to change
        text_content (str): the text to change
    """
    query = "UPDATE documents SET content = %s, last_viewed_date = %s WHERE document_id = %s"
    c = conn.cursor()
    c.execute(query, (text_content, time.strftime('%Y-%m-%d %H:%M:%S'), doc_id))
    conn.commit()


def create_document():
    """Create the document with id specified

    Args:
        doc_id (int): doc with id specifed
    Returns:
        int: return the id generated
    """
    query = 'INSERT INTO documents(document_id, creation_date, last_viewed_date, content) VALUES (%s, %s, %s, %s)'
    query_update = 'UPDATE documents SET document_id = %s where id = %s'
    date_time = time.strftime('%Y-%m-%d %H:%M:%S')
    c = conn.cursor()

    c.execute(query, ("wait", date_time, date_time, base_code))
    doc_id = utils.uuid(c.lastrowid)
    c.execute(query_update, (doc_id, c.lastrowid))
    conn.commit()
    return doc_id


def delete_old_document(days):
    """Delete document according to days and their last_viewed_date
    """
    limit_date = (datetime.datetime.today() - datetime.timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
    query = 'DELETE FROM documents WHERE last_viewed_date < %s'
    c = conn.cursor()
    c.execute(query, (limit_date,))
    conn.commit()

