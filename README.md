# CodeWe
CodeWe is an open-source live code-sharing website developed in Javascript using [express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

![codeWe](https://github.com/allEyezOnCode/CodeWe/blob/dev/imgs/codeTogether.png?raw=True "codeWe")

<img src="https://github.com/allEyezOnCode/CodeWe/blob/dev/imgs/codewe.png?raw=True " height="300"/>

## Installation
### Requirements
For CodeWe to run, you need...
* [Node.js](https://nodejs.org/en/download/) v14.15.1 or newer
* [git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.com/)

Got everything? Great!

### Copying this repository and setting CodeWe up.
The first step is to clone this repository.

Open a terminal and run:
```bash
git clone https://github.com/allEyezOnCode/CodeWe.git
```

Next step is to install dependencies.
```bash
cd CodeWe
npm install
```

## Database
CodeWe uses MongoDB to store the documents, so install it from the official [MongoDB](https://www.mongodb.com/) site.

## Configuration file
Before running the project you need to create the configuration file `config/config.json` using `config/config dist.json` as a template with your information, like the host, the port, your database credentials, etc.

Start by copying the file with `cp config/config dist.json config/config.json`.

## Running CodeWe
To run the server, run a shell in the `CodeWe/src` folder and execute:
```bash
node server.js
```

## Next features

* [ ] Document with privileges (anon auth, and jwt usage)
* [ ] New programming languages
* [ ] More options
* [ ] Server monitoring with prometheus and grafana

## Contribution
Feel free to contribute, open an issue, then fork the repo and submit a PR.

## Licence
This project is under MIT licence. The full licence can be read [here](https://github.com/allEyezOnCode/CodeWe).
