queries = {
    'create_document' : {
        'mysql': 'INSERT INTO documents(document_id, creation_date, last_viewed_date, content) VALUES (%s, %s, %s, %s)',
        'sqlite': 'INSERT INTO documents(document_id, creation_date, last_viewed_date, content) VALUES (?, ?, ?, ?)'
    },
    'create_document_update': {
        'mysql': 'UPDATE documents SET document_id = %s where id = %s',
        'sqlite': 'UPDATE documents SET document_id = ? where id = ?'
    },
    'delete_old_document' : {
        'mysql': 'DELETE FROM documents WHERE last_viewed_date < %s',
        'sqlite': 'DELETE FROM documents WHERE last_viewed_date < ?'
    },
    'update_document': {
        'mysql': 'UPDATE documents SET content = %s, last_viewed_date = %s WHERE document_id = %s',
        'sqlite': 'UPDATE documents SET content = ?, last_viewed_date = ? WHERE document_id = ?'
    },
    'get_document' : {
        'mysql': 'SELECT * FROM documents WHERE document_id = %s',
        'sqlite': "SELECT * FROM documents WHERE document_id = ?"
    }
}