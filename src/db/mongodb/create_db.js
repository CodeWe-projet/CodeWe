/**
 * Create MongoDB database
 * @module db/mongodb/create_db
 * @date 19-11-20
 * @version 0.1.0
 * @requires mongodb
 * @NOTE: run as `mongo <file>`
 */

const connection = new Mongo();
let db = connection.getDB("codewe").getSiblingDB("codewe");

// Frist drop old database
print(db.dropDatabase());

// Create collection
db.createCollection("codewe", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["documentId", "creationDate", "lastViewDate", "documentOwner", "linkEidt"],
      properties: {
        documentId: {
          bsonType: "string",
          description: "Document ID: string - REQUIRED."
        },
        creationDate: {
          bsonType: "date",
          description: "Date document created: date - REQUIRED"
        },
        lastViewDate: {
          bsonType: "date",
          description: "Date document last viewed: date - REQUIRED"
        },
        content: {
          bsonType: "object",
          description: "Document content: object"
        },
        customDocumentName: {
          bsonType: "string",
          description: "User-defined document name: string"
        },
        documentOwner: {
          bsonType: "string",
          description: "Document owner: string - REQUIRED"
        },
        editors: {
          bsonType: "object",
          description: "People alloew to edit the document. If empty, document is public: object"
        },
        linkEidt: {
          bsonType: "string",
          description: "Link for editing: string - REQUIRED"
        },
        linkVeiw: {
          bsonType: "string",
          description: "Link for viewing: string"
        },
        language: {
          bsonType: "string",
          description: "Programming language: string"
        },
        tab: {
          bsonType: "int",
          description: "soft tab length. 0 = hard tab: int"
        }
      }
    }
  }
})
