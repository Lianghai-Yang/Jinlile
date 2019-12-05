var express = require('express');
var router = express.Router();
const data = require("../database/src");
const userData = data.users;
const groupData = data.groups
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)

router.post('/:groupName', async (req, res, next) => {
    let { groupName } = req.params
    
    let group = null

    try {
        group = await groupData.getByGroupName(groupName)
    }
    catch(e) {
        let createdGroup = await groupData.create(groupName)
        let { user } = req.session
        await groupData.addUserToGroup(groupName, user._id, user.name)
        await userData.addGroupToUser(user.name, createdGroup._id, groupName)
        createdGroup = await groupData.getById(createdGroup._id)
        user = await userData.getById(user._id, { email_code: 0 })
        
        Object.assign(req.session.user, user)
        return res.send({ msg: 'ok', group: { groupId: createdGroup._id, groupName: createdGroup.name } })
    }

    return res.send({ msg: 'group exists' })
})

module.exports = router