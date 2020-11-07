import sqlite3

if __name__ == "__main__":
    conn = sqlite3.connect("documents.db", check_same_thread=False)
    c = conn.cursor()
    c.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, document_id, creation_date, last_viewed_date, content)")
    conn.commit()
    conn.close()