# CodeWe

CodeWe is an open-source live code-sharing website developed in python with flask.

## Installation

### Classic installation

#### Requirements

* [python](https://www.python.org/downloads/) 3.7 or newer (this project is developed in python 3.8.3 and up)
* pip
* [git](https://git-scm.com/downloads)
* MySQL, MariaDB or sqlite (include in python standard library)

The first step is to clone this repository, so open a terminal and run:
```bash
git clone https://github.com/allEyezOnCode/CodeWe.git
```

Install project requirements and dependencies
```bash
cd CodeWe
pip install -Ur requirements.txt
# or
pip3 install -Ur requirements.txt
```

#### Databases
By default, CodeWe runs with a MySQL database, should you have one available, great! No? Fear not my friend! Use SQLite.

#### Mysql or MariaDB
Should you have a MySQL or MariaDB database server, execute the following in your SQL shell to create the database.
```mysql
mysql> source /src/db/sql_files/create_db.sql;
```

Fill out (change `[**redacted**]` to real passwords (:warning: do not share :warning:)) and then run `/src/db/sql_files/users.sql` in your SQL shell to create the users.

The last step is to modify the `/src/config/db_config.dist.py`, with your credentials
Using `cp /src/config/db_config.dist.py /src/config/db_config.py`, copy the database configuration file and fill it with the info needed.

#### Sqlite
(skip this if you use mysql/MariaDB)

Simply execute
```shell
python[3] /src/db/create_sqlite_db.py
```

 and change `DB_TYPE` to `"sqlite"` in `/src/config/config.py`.

### Build with docker *(instable)*
```bash
sudo docker-compose up -d --no-deps --build
```

Help wanted configuring it correctly!

## Rununing `CodeWe`
### With classic installation

To run the server, run a shell in the `CodeWe/src` folder and run:

```bash
python main.py [ip [port]]
# or
python3 main.py [ip [port]]
```

## Plans for V2

* [ ] Migration to Nodejs (insted of flask)
* [ ] Store document as `json` or an array in Database

## Licence

This project is under the MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe/blob/master/LICENCE.md).
