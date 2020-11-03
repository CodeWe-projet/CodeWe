import sqlite3, time


def dict_factory(cursor, row):
    # FROM PYTHON docs
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

conn = sqlite3.connect('documents.db', check_same_thread=False)
conn.row_factory = dict_factory


def get_document(doc_id):
    """Get doc in the databse with id specified

    Args:
        doc_id (int): id of the doc to modify

    Returns:
        tuple: all values with the document
    """
    query = "SELECT * FROM documents WHERE doc_id = ?"
    c = conn.cursor()
    c.execute(query, (doc_id,))
    return c.fetchone()



def update_document(doc_id, text_content):
    """Update the document in the db with the id specified

    Args:
        doc_id (int): id of the document to change
        text_content (str): the text to change
    """
    query = "UPDATE documents SET text = ? WHERE doc_id = ?"
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
    query_update = 'UPDATE documents SET doc_id = ? where id = ?'
    timestamp = time.time()
    c = conn.cursor()

    c.execute(query, (timestamp, timestamp))
    #FIXME Generate a string id
    doc_id = c.lastrowid
    c.execute(query_update, (doc_id, c.lastrowid))
    conn.commit()
    return doc_id


