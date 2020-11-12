# CodeWe
CodeWe is a open source live code sharing website developed in python with flask

## Install
* python 3.7 >= 
* git
First step is to clone the repo, open a terminal and run :
```bash
git clone https://github.com/allEyezOnCode/CodeWe.git
```
```bash
cd CodeWe
pip install -r requirements.txt
```
### Build with docker (instable)
change Host to 0.0.0.0 and run the following :

`sudo docker-compose up`

`sudo docker-compose up -d --no-deps --build`

Help wanted to configure it correctly

## Usage
To run the server, open a terminal in the folder and run :
```bash
python main.py [ip [port]]
```

## Licence 
This projects is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).