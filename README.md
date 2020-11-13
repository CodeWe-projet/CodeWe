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
# or on debian
pip3 install -Ur requirements.txt
```

#### Databases

CodeWe runs by default with a mysql database, so you need to host one, but if you do not have such a database, fear not my friend! You can use Sqlite.

#### Mysql or MariaDB

Should you have a MySQL or MariaDB database server, execute the following in your sql shell to create the database.

```mysql
mysql> source /src/db/sql_files/create_db.sql;
```

Fill out (chage `[**redacted**]` to real passwords (do not share)) and then run `/src/db/sql_files/users.sql` in your sql shell to create the users.

The last step is to modify the /src/config/db_config.dist.py, with your credentials

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
# or on debian
python3 main.py [ip [port]]
```

## Licence
This project is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).
