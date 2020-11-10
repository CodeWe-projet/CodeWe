import hashlib
import base64


def uuid(i, length=5):
    byte_i = str(i).encode()
    digest = hashlib.md5(byte_i).digest()
    b64 = base64.urlsafe_b64encode(digest)
    return b64.decode()[:length]


def dict_factory(cursor, row):
    # FROM PYTHON docs
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d