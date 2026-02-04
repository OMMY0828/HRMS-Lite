import os
from django.conf import settings
from pymongo import MongoClient

DEFAULT_URI = getattr(settings, 'MONGODB_URI', None) or os.getenv(
    'MONGODB_URI',
    'mongodb+srv://ommy:uhxoTHeFvWRq2PpN@ommy.sxoybwn.mongodb.net/hrmslitebd'
)


def _create_client(uri: str):
    try:
        # small timeout to fail fast when local network/credentials are incorrect
        return MongoClient(uri, serverSelectionTimeoutMS=5000)
    except Exception:
        # Let the import succeed; connection errors will surface when used.
        return MongoClient(uri)


client = _create_client(DEFAULT_URI)
db = client[os.getenv('MONGODB_DB', getattr(settings, 'MONGODB_DB', 'hrms_lite'))]

def _mask_uri(uri: str) -> str:
    try:
        # hide credentials for logs
        if '@' in uri and '://' in uri:
            head, tail = uri.split('://', 1)
            creds, rest = tail.split('@', 1)
            if ':' in creds:
                user, pwd = creds.split(':', 1)
                return f"{head}://{user}:***@{rest}"
    except Exception:
        pass
    return uri

try:
    client.server_info()
    print('MongoDB connection established to', _mask_uri(DEFAULT_URI))
except Exception as e:
    print('Warning: could not connect to MongoDB during import to', _mask_uri(DEFAULT_URI), '-', e)
    print('If you intend to use Atlas, ensure `MONGODB_URI` is set in backend/.env or environment,')
    print('and that your IP is allowed in Atlas Network Access. Also install `dnspython` for srv URIs:')
    print('    pip install dnspython')
