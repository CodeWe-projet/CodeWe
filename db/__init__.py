from .db import DB
from db.auth import DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT

db = DB(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT)