const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

const collections = {
  users: getCollectionFn("users"),
  groups: getCollectionFn("groups")
};

async function indexes() {
  let groups = await collections.groups();
  groups.createIndex(
    { name: 1 },
    { unique: true },
    (err, result) => {
      if (err) console.log(err)
    }
  )
}

indexes()

module.exports = collections