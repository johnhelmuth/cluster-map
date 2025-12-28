# Initialization data for MongoDB.

NOTE: This is a destructive operation, and all data that might have been changed since the
last time this was run will be removed and replaced with the data in the source code.

The easiest way to completely erase and re-initialize the database with the current datasets
from the source code is to use the
`<PROJECT_ROOT>/servers/data/init-data/scripts/init-collections.mongo.sh` script.

This script assumes that the MongoDB server is running on the local machine, and that the `mongosh` and `mongoimport`
utilities are in the PATH of the running environment.

Running it will drop and then create each of the MongoDB collections and configure MongoDB to validate documents
with current schemas. It then imports the data sets from this directory into those collections.

To run the script:
```bash
cd servers/data/init-data
./scripts/init-collections.mongo.sh
```

TODO: Re-work the connection details on these scripts so they can be used in a database environment that is not 
local, e.g. one that requires a connection string to connect.
