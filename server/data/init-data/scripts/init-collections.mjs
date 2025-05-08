
import mongoUniverseSchema from '../../db-schemas/mongo-universe.schema.json' with { type: 'json'};
import mongoClusterSchema from '../../db-schemas/mongo-cluster.schema.json' with { type: 'json'};
import mongoSystemSchema from '../../db-schemas/mongo-system.schema.json' with { type: 'json'};

import mongoUserSchema from '../../db-schemas/mongo-user.schema.json' with { type: 'json'};
import mongoUserAuthDataSchema from '../../db-schemas/mongo-user-auth-data.schema.json' with { type: 'json'};

export const mongoCollections = {
  universes: mongoUniverseSchema,
  clusters: mongoClusterSchema,
  systems: mongoSystemSchema,
  users: mongoUserSchema,
  usersAuthData: mongoUserAuthDataSchema,
}

async function initCollection(db, name, schema) {
  console.log('initCollection: ', name);
  await db[name].drop();
  await db.createCollection(name, {
    validator: {
      "$jsonSchema": schema
    }
  })
}

export async function initUniversesCollection(db) {
  return initCollection(db, 'universes', mongoUniverseSchema);
}

export async function initClustersCollection(db) {
  return initCollection(db, 'clusters', mongoClusterSchema);
}

export async function initSystemsCollection(db) {
  return initCollection(db, 'systems', mongoSystemSchema);
}

export async function initUsersCollection(db) {
  return initCollection(db, 'users', mongoUserSchema);
}

export async function initAuthDataCollection(db) {
  return initCollection(db, 'usersAuthData', mongoUserAuthDataSchema);
}

export async function initCollections(db) {
  for (const collName in mongoCollections) {
    await initCollection(db, collName, mongoCollections[collName]);
  }
}
