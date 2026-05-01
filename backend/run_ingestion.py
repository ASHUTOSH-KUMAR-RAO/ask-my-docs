import sys
import json
from ingestion import ingest_document

if __name__ == "__main__":
    document_id = sys.argv[1]
    file_path = sys.argv[2]
    result = ingest_document(document_id, file_path)
    print(json.dumps(result))
