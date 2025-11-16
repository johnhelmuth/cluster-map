#! /usr/bin/env bash

echo "Importing initializing schemas..."
mongosh clustermap <<'HERE'
const init = require("./scripts/init-collections.mjs")
(async (db) => { await init.initCollections(db)})(db)
HERE

echo "Importing systems..."
mongoimport --jsonArray --db=clustermap --collection=systems --maintainInsertionOrder --stopOnError < systems-db.json
echo "Importing clusters..."
mongoimport --jsonArray --db=clustermap --collection=clusters --maintainInsertionOrder --stopOnError < clusters-db.json
echo "Importing universes..."
mongoimport --jsonArray --db=clustermap --collection=universes --maintainInsertionOrder --stopOnError < universes-db.json

if [[ -r tokens-db.json ]]
then
  echo "Importing tokens..."
  mongoimport --jsonArray --db=clustermap --collection=tokens --maintainInsertionOrder --stopOnError < tokens-db.json
fi
echo "Importing users..."
mongoimport --jsonArray --db=clustermap --collection=users --maintainInsertionOrder --stopOnError < users-db.json
echo "Importing users-auth..."
mongoimport --jsonArray --db=clustermap --collection=usersAuth --maintainInsertionOrder --stopOnError < users-auth-db.json



