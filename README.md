# CodeWe

CodeWe is an open-source live code-sharing website developed in Javascript with [express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

![codeWe](https://github.com/allEyezOnCode/CodeWe/blob/master/imgs/ex.gif?raw=True "codeWe - exemple")

<img src="https://github.com/allEyezOnCode/CodeWe/blob/master/imgs/codewe.png?raw=True " height="300"/>

## Installation

### Classic installation

#### Requirements

* [Node.js](https://nodejs.org/en/download/) 14.15.1 or newer (this project is developed with the 14.15.1v)
* [git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.com/)

The first step is to clone this repository.

Open a terminal and run:

```bash
git clone https://github.com/allEyezOnCode/CodeWe.git
```

Next step is to install depedencies

```bash
cd CodeWe
npm install
```

#### Databases

Codewe uses MongoDB to store the documents. So install it from the official [MongoDB](https://www.mongodb.com/) site

### Configuration file

Before running the project you need to create the configuration file `config/config.json` from the `config/config dist.json` with your informations, like the host, the port, your database credentials, etc.

## Running `CodeWe`

### With classic installation

To run the server, run a shell in the `CodeWe/src` folder and run:

```bash
node ./src/server.js
```

## Next features

* Document with privileges (anon auth, and jwt usage)
* New programming langages
* More options
* Server montioring with prometheus and grafana

## Contribution

Feel free to contribute, open an issue, then fork the repo and submit a PR.

## Licence

This project is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).
