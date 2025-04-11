# Initialization data for mongodb.

In order to initialize a mongodb database, use these destructive `mongoimport` commands on the `*.db.json` files in this directory:

```bash
mongoimport --uri=<MONGO CONNECTION STRING> --db=clustermap --collection=universes --drop --maintainInsertionOrder --stopOnError < universes-db.json
```
