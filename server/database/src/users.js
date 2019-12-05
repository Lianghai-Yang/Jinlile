const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");

const getById = async (id, projection={}) =>{
    if (!id) throw "You must provide an id to search for";
    const userCollection = await users();
    const usergo = await userCollection.findOne({ _id: id }, { projection });
    if (usergo === null) throw "No student with that id";
    return usergo;
  };

const create = async (name,email,groups = [],email_code) => {
    if(!name || typeof(name)!=="string") throw "You must provide a name";
    if(!email || typeof(email)!=="string") throw "You must provide an email";
    if(!email_code || typeof(email_code)!=="string") throw "You must init an email_code";

    const userCollection = await users();
    const id = uuid.v4();

    const newUser = {
      _id: id,
      name: name,
      email:email,
      groups:groups,
      email_code:email_code
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) console.log("Could not add user");
    const newId = insertInfo.insertedId;

    const student = await getById(newId);
    return student;
}

const removeById = async (id) =>{
  if (!id) throw "You must provide an id to search for";
  const userCollection = await users();
  const user = await getById(id);
  const deletionInfo = await userCollection.removeOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete student with id of ${id}`;
  }
  return user;
};

const getByUserName = async(userName, projection={}) => {
  if (!userName) throw "You must provide a userName to search for";
  const userCollection = await users();
  const userGo = await userCollection.findOne({name: userName}, { projection: projection });
  if (userGo === null) throw "No user with that name";
  return userGo;
};

const addGroupToUser = async (userName,groupId,groupName) =>{
    if (!userName) throw "You must provide a userName to search for";
    if (!groupId) throw "You must provide a groupId to search for";
    if (!groupName) throw "You must provide a groupName to search for";
        
    const userCollection = await users();

    const targetUser = await getByUserName(userName);
    let groupList = targetUser.groups;
    groupList.push({groupId,groupName});
    await userCollection.updateOne({name: userName},{$set: { "groups": groupList }});
    return await getByUserName(userName);
}

const getByUserEmail = async(userEmail, projection={}) => {
  if (!userEmail) throw "You must provide a userName to search for";
  const userCollection = await users();
  const userGo = await userCollection.findOne({email: userEmail}, { projection: projection });
  if (userGo === null) throw "No user with that name";
  return userGo;
};

const createCode = async (userEmail, projection={}) => {
  if(!userEmail) throw "You must provide a userEmail to search for";

  const userCollection = await users();

  var randomCode = "";
  for(let i = 0; i<4; i++){
    var randomDigit = Math.floor(Math.random() * 10);
    randomCode += randomDigit;
  }

  //check whether we have this email in our database, if yes, we update its code, or we create a new user
  const userGo = await userCollection.findOne({email: userEmail}, { projection: projection });
  if(userGo!=null){
    //console.log("DB: user find");
    await userCollection.updateOne({email: userEmail},{$set: {email_code: randomCode}});
  }
  else{
    //console.log("DB: user NOT find");
    await create(userEmail.split('@')[0],userEmail,[],randomCode);
  }

  return randomCode;
};

const getCodeByUserEmail = async(userEmail) =>{
  if (!userEmail) throw "You must provide a userName to search for";
  //console.log("we hit getCode in database");
  const userGo = await getByUserEmail(userEmail);
  return userGo.email_code;
}


module.exports = {
    create,
    getById,
    removeById,
    getByUserName,
    addGroupToUser,
    createCode,
    getByUserEmail,
    getCodeByUserEmail
}