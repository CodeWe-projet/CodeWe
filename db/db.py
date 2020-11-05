import time

import utils
from db.auth import DB_HOST, DB_USERNAME, DB_PASSWORD

import mysql.connector


base_code = "def main(text: str) -> None:\n    print(text)\n\nif __name__ == '__main__':\n    main('Hello World !')"


conn = mysql.connector.connect(
  host=DB_HOST,
  user=DB_USERNAME,
  password=DB_PASSWORD
)


def get_document(doc_id):
    """Get doc in the databse with id specified

    Args:
        doc_id (int): id of the doc to modify

    Returns:
        tuple: all values with the document
    """
    query = "SELECT * FROM documents WHERE document_id = %s"
    c = conn.cursor()
    c.execute(query, (doc_id,))
    return c.fetchone()


def update_document(doc_id, text_content):
    """Update the document in the db with the id specified

    Args:
        doc_id (int): id of the document to change
        text_content (str): the text to change
    """
    query = "UPDATE documents SET text = %s, last_seen = %s WHERE document_id = %s"
    c = conn.cursor()
    c.execute(query, (text_content, time.time(), doc_id))
    conn.commit()


def create_document():
    """Create the document with id specified

    Args:
        doc_id (int): doc with id specifed
    Returns:
        int: return the id generated
    """
    query = 'INSERT INTO documents(creation_date, last_seen, text) VALUES (%s, %s, %s)'
    query_update = 'UPDATE documents SET document_id = %s where id = %s'
    timestamp = time.time()
    c = conn.cursor()

    c.execute(query, (timestamp, timestamp, base_code))
    doc_id = utils.uuid(c.lastrowid)
    c.execute(query_update, (doc_id, c.lastrowid))
    conn.commit()
    return doc_id


