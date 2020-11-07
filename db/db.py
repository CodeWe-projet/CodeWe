import time
import datetime
import json
import random
import mysql.connector

import utils
from db.auth import DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT

random.seed()

base_code = json.dumps([
    [f"{utils.uuid(random.random(), 10)}", "def main(text: str) -> None:"],
    [f"{utils.uuid(random.random(), 10)}", "    print(text)"],
    [f"{utils.uuid(random.random(), 10)}", ""],
    [f"{utils.uuid(random.random(), 10)}", "if __name__ == \'__main__\':"],
    [f"{utils.uuid(random.random(), 10)}", "    main(\'Hello World !\')"]
])


class DB:
    def __init__(self):
        self.conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USERNAME,
            password=DB_PASSWORD,
            database=DB_DATABASE
        )
        self.cursor = self.conn.cursor()
    
    
    def fetch_as_dict(self, query, args):
        c = self.conn.cursor(dictionary=True)
        c.execute(query, args)
        return c.fetchone()
    
    def execute(self, query, args):
        self.cursor.execute(query, args)
    

    def get_document(self, doc_id):
        """Get doc in the databse with id specified

        Args:
            doc_id (int): id of the doc to modify

        Returns:
            tuple: all values with the document
        """
        query = "SELECT * FROM documents WHERE document_id = %s"
        return self.fetch_as_dict(query, (doc_id,))


    def update_document(self, doc_id, text_content):
        """Update the document in the db with the id specified

        Args:
            doc_id (int): id of the document to change
            text_content (str): the text to change
        """
        query = "UPDATE documents SET content = %s, last_viewed_date = %s WHERE document_id = %s"
        self.execute(query, (doc_id, text_content))
        self.conn.commit()


    def create_document(self):
        """Create the document with id specified

        Args:
            doc_id (int): doc with id specifed
        Returns:
            int: return the id generated
        """
        query = 'INSERT INTO documents(document_id, creation_date, last_viewed_date, content) VALUES (%s, %s, %s, %s)'
        query_update = 'UPDATE documents SET document_id = %s where id = %s'
        date_time = time.strftime('%Y-%m-%d %H:%M:%S')
        c = self.conn.cursor()
        c.execute(query, ("wait", date_time, date_time, base_code))
        doc_id = utils.uuid(c.lastrowid)
        c.execute(query_update, (doc_id, c.lastrowid))
        self.conn.commit()
        return doc_id


    def delete_old_document(self, days):
        """Delete document according to days and their last_viewed_date
        """
        limit_date = (datetime.datetime.today() - datetime.timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
        query = 'DELETE FROM documents WHERE last_viewed_date < %s'
        self.execute(query, (limit_date,))