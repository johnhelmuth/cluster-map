#! /usr/bin/env bash

mongosh clustermap <<'HERE'
const init = require("./scripts/init-collections.mjs")
(async (db) => { await init.initCollections(db)})(db)
HERE

mongoimport --jsonArray --db=clustermap --collection=systems --maintainInsertionOrder --stopOnError < systems-db.json
mongoimport --jsonArray --db=clustermap --collection=clusters --maintainInsertionOrder --stopOnError < clusters-db.json
mongoimport --jsonArray --db=clustermap --collection=universes --maintainInsertionOrder --stopOnError < universes-db.json
mongoimport --jsonArray --db=clustermap --collection=users --maintainInsertionOrder --stopOnError < users-db.json
mongoimport --jsonArray --db=clustermap --collection=usersAuth --maintainInsertionOrder --stopOnError < users-auth-db.json



