from flask import Blueprint, request, jsonify
import db.db as db
from api.data import DEBUG


api = Blueprint("api", __name__)


@api.route('/download', methods=['POST'])
def download():
    try:
        doc_id = request.form['doc_id']
        content = db.get_document(doc_id)
        return jsonify({"success": (content is not None), "content": content})
    except Exception as e:
        if DEBUG:
            return jsonify({"success": False, "message": str(e)})
        else:
            return jsonify({"success": False})


@api.route('/create_document', methods=['POST'])
def create_document():
    try:
        doc_id = db.create_document()
        return jsonify({"succes": True, "doc_id": doc_id})
    except Exception as e:
        if DEBUG:
            return jsonify({"success": False, "message": str(e)})
        else:
            return jsonify({"success": False})  # , 'details': str(e)


@api.route('/upload', methods=['POST'])
def upload():
    try:
        print(request.json)
        doc_id, doc_content = request.json['doc_id'], request.json['doc_content']
        db.update_document(doc_id, doc_content)
        return jsonify({"succes": True, "uploaded": True})
    except Exception as e:
        if DEBUG:
            return jsonify({"success": False, "message": f"{e.__class__.__name__}: {e!s}"})
        else:
            return jsonify({"success": False})
