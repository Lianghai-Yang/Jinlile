//const dbConnection = require("../database/data/mongoConnection");
const dbConnection = require("../src/mongoConnection")
const data = require("../src");
const users = data.users;
const groups = data.groups;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    try{
        let JG = await users.create("Jiacheng Guo", "guojiacheng.bupt@gmail.com", [],"default");
        let YL = await users.create("Yi Li", "liyicynthia@gmail.com", [],"default");
        let tester = await users.create("tester", "tester@gmail.com",[],"default");
        let group1 = await groups.create("Group1", [], []);
        let group2 = await groups.create("Group2", [], []);

        await groups.addUserToGroup(group1.name,JG._id,JG.name);
        await groups.addUserToGroup(group1.name,YL._id,YL.name);
        await groups.addUserToGroup(group2.name,tester._id,tester.name);

        await users.addGroupToUser(JG.name,group1._id,group1.name);
        await users.addGroupToUser(YL.name,group1._id,group1.name);
        await users.addGroupToUser(tester.name,group2._id,group2.name);

        await groups.addMessageToGroup(group1.name,JG._id,JG.name,"hello guys in group1", "Nov 8th, 2019, 7:00 PM");
        await groups.addMessageToGroup(group1.name,JG._id,JG.name,"Im Jiacheng", "Nov 8th, 2019, 7:01 PM");
        await groups.addMessageToGroup(group2.name,tester._id,tester.name,"hello guys in group2", "Nov 8th, 2019, 7:02 PM");
        //await groups.addMessageToGroup(group2.name,YL._id,YL.name,"hello guys in group2, I'm Yi Li", "Nov 8th, 2019, 7:02 PM");
        await db.serverConfig.close();
    }
    catch(e){
        console.log(e);
        await db.serverConfig.close();
    }
    
};

main().catch(console.log);
