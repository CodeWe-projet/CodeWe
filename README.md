# CodeWe

CodeWe is an open-source live code-sharing website developed in python with flask.

## Installation

### Classic installation

#### Requirements
* python 3.7 or newer (this project is developed in python 3.8.3 and up)
* git

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

#### Run the project
To run the server, run a shell in the `CodeWe/src` folder and run:
```bash
python main.py [ip [port]]
# or on debian
python3 main.py [ip [port]]
```

### Build with docker *(instable)*
```bash
sudo docker-compose up -d --no-deps --build
```

Help wanted configuring it correctly!

## Licence
This project is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).
