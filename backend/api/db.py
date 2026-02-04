import os
from django.conf import settings
from pymongo import MongoClient

# -------------------------------------------------
# MongoDB configuration (ENV VARS ONLY)
# -------------------------------------------------

MONGODB_URI = (
    getattr(settings, "MONGODB_URI", None)
    or os.getenv("MONGODB_URI")
)

MONGODB_DB = (
    getattr(settings, "MONGODB_DB", None)
    or os.getenv("MONGODB_DB")
)

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is not set. "
        "Define it in environment variables or Django settings."
    )

if not MONGODB_DB:
    raise RuntimeError(
        "MONGODB_DB is not set. "
        "Define it in environment variables or Django settings."
    )


# -------------------------------------------------
# Mongo client
# -------------------------------------------------

def _create_client(uri: str):
    return MongoClient(uri, serverSelectionTimeoutMS=5000)


client = _create_client(MONGODB_URI)
db = client[MONGODB_DB]


# -------------------------------------------------
# Helpers
# -------------------------------------------------

def _mask_uri(uri: str) -> str:
    try:
        if "://" in uri and "@" in uri:
            scheme, rest = uri.split("://", 1)
            creds, host = rest.split("@", 1)
            if ":" in creds:
                user, _ = creds.split(":", 1)
                return f"{scheme}://{user}:***@{host}"
    except Exception:
        pass
    return uri


# -------------------------------------------------
# Connection test (non-fatal)
# -------------------------------------------------

try:
    client.server_info()
    print("MongoDB connected:", _mask_uri(MONGODB_URI))
except Exception as e:
    print(
        "⚠️ Warning: MongoDB connection failed:",
        _mask_uri(MONGODB_URI),
        "-",
        e,
    )
    print(
        "Ensure MONGODB_URI and MONGODB_DB are set "
        "and your IP is allowed in MongoDB Atlas."
    )