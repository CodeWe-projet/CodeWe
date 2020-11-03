import sqlite3

conn = sqlite3.connect("documents.db")
c = conn.cursor()

c.execute("CREATE TABLE documents (id, creation_date, last_seen, text)")

conn.commit()
conn.close()