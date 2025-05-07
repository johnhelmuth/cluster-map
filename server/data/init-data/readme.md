# Initialization data for mongodb.

In order to initialize a mongodb database, use these destructive `mongoimport` commands on the `*.db.json` files in this directory:

```bash
mongoimport --uri=<MONGO CONNECTION STRING> --jsonArray --db=clustermap --collection=systems --drop --maintainInsertionOrder --stopOnError < systems-db.json
mongoimport --uri=<MONGO CONNECTION STRING> --jsonArray --db=clustermap --collection=clusters --drop --maintainInsertionOrder --stopOnError < clusters-db.json
mongoimport --uri=<MONGO CONNECTION STRING> --jsonArray --db=clustermap --collection=universes --drop --maintainInsertionOrder --stopOnError < universes-metadata-db.json
```

When running the mongodb server locally, mongoimport will be able to connect with no connection string, so drop that parameter to initialize the database.

```bash
mongoimport --jsonArray --db=clustermap --collection=systems --drop --maintainInsertionOrder --stopOnError < systems-db.json
mongoimport --jsonArray --db=clustermap --collection=clusters --drop --maintainInsertionOrder --stopOnError < clusters-db.json
mongoimport --jsonArray --db=clustermap --collection=universes --drop --maintainInsertionOrder --stopOnError < universes-db.json
```
