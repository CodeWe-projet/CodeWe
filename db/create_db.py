import sqlite3

if __name__ == "__main__":
    conn = sqlite3.connect("documents.db")
    c = conn.cursor()

    c.execute("CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, creation_date, last_seen, text)")

    conn.commit()
    conn.close()