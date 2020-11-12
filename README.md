# CodeWe

CodeWe is a open source live code sharing website developed in python with flask

## Installation

### Classic installation

#### Requirements

* python 3.7 or newer
* git

The first step is to clone the repo, so open a terminal and run :

```bash
git clone https://github.com/allEyezOnCode/CodeWe.git
```

Install project requirements

```bash
cd CodeWe
pip install -r requirements.txt
```

#### Run the project

To run the server, open a terminal in the folder and run :

```bash
cd src
python main.py [ip [port]]
```

### Build with docker (instable)

```bash
sudo docker-compose up -d --no-deps --build
```

Help wanted to configure it correctly!

## Licence

This projects is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).