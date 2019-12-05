const validator = require('validator')
var express = require('express');
var router = express.Router();
const data = require("../database/src");
const userData = data.users;
const groupData = data.groups
const mailer = require('../mailer')
const authenticate = require('../middlewares/authenticate')
const redis = require('../redisClient')
// const validator = require('validator')

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/code/:code/validated", async (req, res) => {
  try{
    let userCode = req.params.code
    const uid = req.session.user._id;
    if (!uid) {
      return res.status(400).send({ msg: 'invalid user' })
    }
    const { email_code: code } = await userData.getById(uid, { email_code: 1 });
    if (code == userCode) {
      const user = await userData.getById(uid, { email_code: 0 })
      user.loggedIn = true
      req.session.user = user
      res.send({ msg: true, user })
    }
    else {
      res.send({ msg: false })
    }
  }catch(e){
    console.log(e)
    res.sendStatus(500);
  }
});

router.post("/code", async (req,res) => {
  const emailInfo = req.body;
  let { email } = emailInfo
  if (!email) {
    res.status(400).send({ msg: 'missing email' })
  }

  if (validator.isEmail(email) == false) {
    return res.status(400).send({ msg: 'invalid email' })
  }

  try{
    // const email = emailInfo.email;
    const code = await userData.createCode(email);
    mailCode({ code, email })
    const userInfo = await userData.getByUserEmail(email, { _id: 1 })
    req.session.user = {
      ...userInfo,
      loggedIn: false
    }
    res.send({ msg: 'sent', user: userInfo })
  }catch(e){
    console.log(e)
    res.sendStatus(500);
  }
});


router.use(authenticate)

 /**
  * ===================================================
  * Authentication Required for routes below this line!
  * ===================================================
  */
 
router.get('/authenticated', (req, res, next) => {
  res.send({ msg: true })
})

router.get("/:id", async (req, res) => {
  try {
    const user = await userData.getById(req.params.id, { email_code: 0, email: 0 });
    res.json(user);
  } catch (e) {
    res.status(404).json({ message: "not found!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await userData.getById(req.session.user._id, { email_code: 0, email: 0 });
    res.json(user);
  } catch (e) {
    res.status(404).json({ message: "not found!" });
  }
});

router.get('/group/:groupId/positions', async (req, res, next) => {
  let group = null

  try {
    group = await groupData.getById(req.params.groupId)
  }
  catch(e) {
    res.status(500).send({ msg: 'internal server error' })
    console.log(e)
  }
  let userIds = group.users.map(user => user.userId)
  let positions = await redis.geoposAsync('jinlile:positions', ...userIds)

  let result = group.users.map((user, i) => (
    {
      ...user,
      lng: positions[i] ? positions[i][0] : null,
      lat: positions[i] ? positions[i][1] : null,
    }
  ))

  res.send(result)
})

router.put('/position', async (req, res, next) => {
  let { lng, lat } = req.body
  let { user } = req.session
  if (!lng || !lat) {
    return res.status(400).send({ msg: 'missing longitude and latitude'})
  }
  redis.geoaddAsync('jinlile:positions', lng, lat, user._id)
  res.send({ msg: 'ok' })
})

async function mailCode({ email, code }) {
  let info = await mailer.sendMail({
    from: '"Jinlile Team" <team@jinlile.tech>',
    to: email,
    subject: `Your Login Code is ${code}`,
    text: `Thank you for using Jinlile. Your login code is ${code}`
  })
  console.log('message sent')  
}

module.exports = router;