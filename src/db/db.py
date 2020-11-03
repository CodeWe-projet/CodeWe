import sqlite3, time

conn = sqlite3.connect('documents.db', check_same_thread=False)


def get_document(doc_id):
    """Get doc in the databse with id specified

    Args:
        doc_id (int): id of the doc to modify

    Returns:
        tuple: all values with the document
    """
    query = "SELECT * FROM documents WHERE id = ?"
    c = conn.cursor()
    c.execute(query, (doc_id,))
    return c.fetchone()



def update_document(doc_id, text_content):
    """Update the document in the db with the id specified

    Args:
        doc_id (int): id of the document to change
        text_content (str): the text to change
    """
    query = "UPDATE documents SET text = ? WHERE id = ?"
    c = conn.cursor()
    c.execute(query, (text_content, doc_id))
    conn.commit()


def create_document():
    """Create the document with id specified

    Args:
        doc_id (int): doc with id specifed
    Returns:
        int: return the id generated
    """
    query = 'INSERT INTO documents(creation_date, last_seen) VALUES (?, ?)'
    timestamp = time.time()
    c = conn.cursor()
    c.execute(query, (timestamp, timestamp))
    conn.commit()
    return c.lastrowid

