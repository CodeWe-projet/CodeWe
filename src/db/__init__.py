from .db import DB, DBSqlite
from config.db_config import DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT
from config import DB_TYPE

if DB_TYPE.lower() == "mysql":
    db = DB(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT)
else:
    db = DBSqlite(DB_DATABASE)