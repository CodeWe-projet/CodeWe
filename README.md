# CodeWe

[CodeWe](https://codewe.org/) is an open-source live code-sharing website developed in Javascript with [express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

![codeWe](https://github.com/allEyezOnCode/CodeWe/blob/master/imgs/ex.gif?raw=True "codeWe - exemple")

---

## Installation

### Classic installation

#### Requirements

* [Node.js](https://nodejs.org/en/download/) 14.15.1 or newer (this project is developed with the 14.15.1v)
* [git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.com/)

The first step is to clone this repository.

Open a terminal and run:

```bash
git clone https://github.com/CodeWe-projet/CodeWe.git
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

---

## Contribution

Feel free to contribute, open an issue, then fork the repo and submit a PR.


## Licence

This project is under MIT licence. The full licence can be read [here](https://github.com/CodeWe-projet/CodeWe/blob/master/LICENCE.md).

---

## Next features

* Document with privileges (anon auth, and jwt usage)


## Changelog

### Version [2.1.0](https://github.com/CodeWe-projet/CodeWe/pull/40)
#### Back-end
* Preparing the back-end for authentication.
* New prometheus gauges and counter.

#### Front-end
* Adding support of 20+ languages.
* Allow sharing URL by QR Code.
* Customize tabulation size.
* Remove line and others major bugfixes.

### Version [2.0.1](https://github.com/CodeWe-projet/CodeWe/pull/26)
#### Back-end
* Ability to redirect an http port to the main https port.
* Update configuration.
* Minor bug fixes.

#### Front-end
* Update legal content.
* Major bug fixes.

### Version [2.0.0](https://github.com/CodeWe-projet/CodeWe/tree/ad25d132ab92c0b9de227c9aedf04bda3f19681b)
#### Back-end
* Rewriting of the back end in nodejs.

#### Front-end
* Report issue button.
* Minor bug fixes.

### 1.0.0
* Initialisation of project using python and Flask for backend.
