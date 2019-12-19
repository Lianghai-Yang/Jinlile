const mongoCollections = require('./mongoCollections');
const groups = mongoCollections.groups;
const uuid = require('node-uuid');

const getById = async (id) => {
    if(!id) throw "You must provide an id"
    let groupCollection = await groups()
    let result = await groupCollection.findOne({ _id: id })
    return result
};

const create = async (name, users=[], messages=[]) => {
    //console.log("create a group");
    if(!name || typeof(name)!=="string") throw "You must provide a name" 

    let groupCollection = await groups()
    let id = uuid.v4()
    await groupCollection.insertOne({
        _id: id,
        name,
        users,
        messages
    })
    return await getById(id);
};

const removeById = async (id) =>{
    return (await groups()).deleteOne({ _id: id })
};

const getByGroupName = async(groupName) => {
    if (!groupName) throw "You must provide a groupName to search for";
    const groupCollection = await groups();
    const groupGo = await groupCollection.findOne({name: { $regex : new RegExp(groupName, "i") } });
    if (groupGo === null) throw "No group with that name";
    return groupGo;
};

const getByGroupId = async(groupId) => {
    if (!groupId) throw "You must provide a groupId to search for";
    const groupCollection = await groups();
    const groupGo = await groupCollection.findOne({_id: groupId});
    if (groupGo === null) throw "No group with that name";
    return groupGo;
};

const addUserToGroup = async (groupName,userId,userName) =>{
    if (!groupName) throw "You must provide a groupName to search for";
    if (!userId) throw "You must provide a userId to search for";
    if (!userName) throw "You must provide a userName to search for";
        
    const groupCollection = await groups();

    const targetGroup = await getByGroupName(groupName);
    let userList = targetGroup.users;
    userList.push({userId,userName});
    await groupCollection.updateOne({name: { $regex : new RegExp(groupName, "i") }},{$set: { "users": userList }});
    return await getByGroupName(groupName);
}

const addMessageToGroup = async(groupName,userId,userName,content,time) => {
    if (!groupName) throw "You must provide a groupName to search for";
    if (!content) throw "You must provide a content to search for";
    if (!userName) throw "You must provide a userName to search for";
    if (!userId) throw "You must provide a userId to search for";
    if (!time) throw "You must provide a time to search for";
    const groupCollection = await groups();

    const targetGroup = await getByGroupName(groupName);
    let userList = targetGroup.users;
    //let bool = userList.includes({userId,userName});
    //let bool = userList.filter(userList => (userList.userName === userName));
    var found = false;
    for(var i = 0; i < userList.length; i++) {
        if (userList[i].userName == userName) {
            found = true;
            break;
        }
    }
    //console.log(found);
    if(!found){
        //console.log("userName is not in list");
        throw "The input user is not in the group's userList";
    }
    let messageList = targetGroup.messages;
    messageList.push({userId,userName,content,time});
    await groupCollection.updateOne({name: { $regex : new RegExp(groupName, "i") }},{$set: { "messages": messageList }});
    return await getByGroupName(groupName);

}

const addMessageToGroupById = async(groupId, userId, userName, content, time) => {
    if (!groupId) throw "You must provide a groupId to search for";
    if (!content) throw "You must provide a content to search for";
    if (!userName) throw "You must provide a userName to search for";
    if (!userId) throw "You must provide a userId to search for";
    if (!time) throw "You must provide a time to search for";
    const groupCollection = await groups();

    const targetGroup = await getByGroupId(groupId);
    let userList = targetGroup.users;
    //let bool = userList.includes({userId,userName});
    //let bool = userList.filter(userList => (userList.userName === userName));
    var found = false;
    for(var i = 0; i < userList.length; i++) {
        if (userList[i].userId == userId) {
            found = true;
            break;
        }
    }
    //console.log(found);
    if(!found){
        //console.log("userName is not in list");
        throw "The input user is not in the group's userList";
    }
    let messageList = targetGroup.messages;
    messageList.push({userId,userName,content,time});
    await groupCollection.updateOne({_id: groupId},{$set: { "messages": messageList }});
    return await getByGroupId(groupId);

}

const getMessageFromGroupName = async(groupName) => {
    if (!groupName) throw "You must provide a groupName to search for";
    //const groupCollection = await groups();
    const targetGroup = await getByGroupName(groupName);
    return targetGroup.messages;
}

const getMessageFromGroupId = async(groupId) => {
    if (!groupId) throw "You must provide a groupId to search for";
    //const groupCollection = await groups();

    const targetGroup = await getById(groupId);
    return targetGroup.messages;
}

const updateUserNameByUserId = async(groupId,userId,newName) => {
    //update both groups list and message list
    if (!groupId) throw "You must provide a groupId to search for";
    if (!userId) throw "You must provide a userId to search for";
    if (!newName) throw "You must provide a newName to search for";
    let groupCollection = await groups();
    const targetGroup = await groupCollection.findOne({_id:groupId});
    let userList = targetGroup.users;
    for(let i = 0; i<userList.length;i++){
        if(userList[i].userId == userId){
            userList[i].userName = newName;
        }
    }
    let messageList = targetGroup.messages;
    for(let i = 0; i<messageList.length; i++){
        if(messageList[i].userId == userId){
            messageList[i].userName = newName;
        }
    }
    await groupCollection.updateOne({_id: groupId},{$set: { "messages": messageList, "users":userList }});
}

// let msg = getMessageFromGroupName("Group1");
// console.log(msg);

const deleteUserFromGroupByGidAndUid = async(userId, groupId) =>{
    let groupCollection = await groups();
    const targetGroup = await groupCollection.findOne({_id: groupId});
    let users = targetGroup.users;
    let updatedUsers = [];
    for(let i = 0; i<users.length; i++){
      if(users[i].userId!=userId){
        updatedUsers.push(users[i]);
      }
    }
    await groupCollection.updateOne({_id: groupId},{$set: {users: updatedUsers}});
    return await groupCollection.findOne({_id: groupId});
  }



module.exports = {
    create,
    getById,
    removeById,
    getByGroupName,
    getByGroupId,
    addUserToGroup,
    addMessageToGroup,
    addMessageToGroupById,
    getMessageFromGroupName,
    getMessageFromGroupId,
    updateUserNameByUserId,
    deleteUserFromGroupByGidAndUid
}