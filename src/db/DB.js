const mysql = require('mysql');
const fs = require('fs');
const utils = require('../utils');


const querySelectDocument = 'SELECT * FROM documents WHERE document_id = ?';
const queryInsert = 'INSERT INTO documents(document_id, creation_date, last_viewed_date, content) VALUES (?, ?, ?, ?)';
const queryUpdateDocumentId = 'UPDATE documents SET document_id = ? where id = ?';
const queryUpdateDocument = "UPDATE documents SET content = ?, last_viewed_date = ? WHERE document_id = ?";

const baseCode = JSON.stringify([
    {uuid: utils.uuid(Math.random().toString(), 10), content: 'def main(text: str) -> None:'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: '    print(text)'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: ''},
    {uuid: utils.uuid(Math.random().toString(), 10), content: 'if __name__ == \'__main__\':'},
    {uuid: utils.uuid(Math.random().toString(), 10), content: '    main(\'Hello World !\')'}
]);

class DB {
    constructor (host, user, password, db, port) {
        this.pool = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: db,
            port: port
        });
    }

    getDocument (docId) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                connection.query(querySelectDocument, [docId], (error, rows) => {
                    connection.release();
                    if (error) reject(error);
                    // Return the document (first result of the results)
                    resolve(rows[0]);
                });
            });
        });
    }

    updateDocument (docId, textContent) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) reject(err);
                let date = new Date();
                connection.query(queryUpdateDocument, [textContent, date, docId], (error, result) => {
                    connection.release();
                    if (error) reject(error);
                });
            });
        });
        
    }

    createDocument () {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) reject(err);
                let date = new Date();
                connection.query(queryInsert, ['temp', date, date, baseCode], (error, result, fields) => {
                    if (error) reject(error);
                    let genId = utils.uuid(result.insertId.toString());
                    connection.query(queryUpdateDocumentId, [genId, result.insertId], (errUpdate, results) => {
                        if (errUpdate) reject(errUpdate);
                        connection.release();
                        resolve(genId);
                    });
                });
            });
        });    
    }
}

// Read the config file for db configuration, etc
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
// Create connection with DB
module.exports = new DB(config.DB_CONFIG.DB_HOST, config.DB_CONFIG.DB_USERNAME, config.DB_CONFIG.DB_PASSWORD, config.DB_CONFIG.DB_DATABASE, config.DB_CONFIG.DB_PORT);