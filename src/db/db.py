import time
import datetime
import json
import random
import sqlite3
import mysql.connector

import utils
from db.sql_query import queries


random.seed()

base_code = json.dumps([
    {'uuid': f'{utils.uuid(random.random(), 10)}', 'content': 'def main(text: str) -> None:'},
    {'uuid': f"{utils.uuid(random.random(), 10)}", 'content': '    print(text)'},
    {'uuid': f"{utils.uuid(random.random(), 10)}", 'content': ''},
    {'uuid': f"{utils.uuid(random.random(), 10)}", 'content': 'if __name__ == \'__main__\':'},
    {'uuid': f"{utils.uuid(random.random(), 10)}", 'content': '    main(\'Hello World !\')'}
])
datetime_format = '%Y-%m-%d %H:%M:%S'


class DB:

    DB_MODE = 'mysql'

    def __init__(self, host, username, password, database, port):
        self.conn = mysql.connector.connect(
            host=host,
            user=username,
            password=password,
            database=database,
            port=port
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
        query = queries['get_document'][self.get_db_mode()]
        return self.fetch_as_dict(query, (doc_id,))

    def update_document(self, doc_id, text_content):
        """Update the document in the db with the id specified

        Args:
            doc_id (int): id of the document to change
            text_content (str): the text to change
        """
        query = queries['update_document'][self.get_db_mode()]
        self.execute(query, (text_content, time.strftime(datetime_format), doc_id))
        self.conn.commit()

    def create_document(self):
        """Create the document with id specified

        Args:
            doc_id (int): doc with id specifed
        Returns:
            int: return the id generated
        """
        query = queries['create_document'][self.get_db_mode()]
        query_update = queries['create_document_update'][self.get_db_mode()]
        date_time = time.strftime(datetime_format)
        c = self.conn.cursor()
        c.execute(query, ("wait", date_time, date_time, base_code))
        doc_id = utils.uuid(c.lastrowid)
        c.execute(query_update, (doc_id, c.lastrowid))
        self.conn.commit()
        return doc_id

    def delete_old_document(self, days):
        """Delete document according to days and their last_viewed_date
        """
        limit_date = (datetime.datetime.today() - datetime.timedelta(days=days)).strftime(datetime_format)
        query = queries['delete_old_document'][self.get_db_mode()]
        self.execute(query, (limit_date,))

    @classmethod
    def get_db_mode(cls):
        return cls.DB_MODE


class DBSqlite(DB):

    DB_MODE = 'sqlite'

    def __init__(self, name):
        self.conn = sqlite3.connect(f'{name}.db', check_same_thread=False)
        self.cursor = self.conn.cursor()
    
    def fetch_as_dict(self, query, args):
        self.cursor.execute(query, args)
        return dict(zip([c[0] for c in self.cursor.description], self.cursor.fetchone()))