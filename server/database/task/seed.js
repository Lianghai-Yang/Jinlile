//const dbConnection = require("../database/data/mongoConnection");
const dbConnection = require("../src/mongoConnection")
const data = require("../src");
const users = data.users;
const groups = data.groups;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    try{
        let Yang = await users.create("Liu Yang", "Yang@gmail.com", [],"default");
        let Wang = await users.create("Hangyu Wang", "Wang@gmail.com", [],"default");
        let Guo = await users.create("Jiacheng Guo", "Guo@gmail.com", [],"default");
        let Hai = await users.create("Lianghai Yang", "Hai@gmail.com", [],"default");
        let group1 = await groups.create("Colleagues", [], []);
        let group2 = await groups.create("Hiking Team", [], []);
        
        await groups.addUserToGroup(group1.name,Hai._id,Hai.name);
        await groups.addUserToGroup(group1.name,Wang._id,Wang.name);
        await groups.addUserToGroup(group2.name,Guo._id,Guo.name);
        await groups.addUserToGroup(group2.name,Yang._id,Yang.name);
        
        await users.addGroupToUser(Wang.name,group1._id,group1.name);
        await users.addGroupToUser(Hai.name,group1._id,group1.name);
        await users.addGroupToUser(Yang.name,group2._id,group2.name);
        await users.addGroupToUser(Guo.name,group2._id,group2.name);

        await groups.addMessageToGroup(group1.name,Hai._id,Hai.name,"hello guys in Colleagues from LiangHai", new Date() );
        await groups.addMessageToGroup(group1.name,Wang._id,Wang.name,"Im Wang", new Date() );
        await groups.addMessageToGroup(group2.name,Guo._id,Guo.name,"hello guys in Hiking Team", new Date() );
        
        await db.serverConfig.close();
    }
    catch(e){
        console.log(e);
        await db.serverConfig.close();
    }
    
};

main().catch(console.log);
