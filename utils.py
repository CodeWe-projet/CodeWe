import hashlib
import base64

def uuid(i):
    byte_i = str(i).encode()
    digest = hashlib.md5(byte_i).digest()
    b64 = base64.urlsafe_b64encode(digest)
    return b64.decode()[:5]