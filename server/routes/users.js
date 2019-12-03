const validator = require('validator')
var express = require('express');
var router = express.Router();
const data = require("../database/src");
const userData = data.users;
const mailer = require('../mailer')
// const validator = require('validator')

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/code", async (req, res) => {
  try{
    console.log("we hit router get code");
    const email = req.query.email;
    const code = await userData.getCodeByUserEmail(email);
    res.json(code);
  }catch(e){
    res.sendStatus(500);
  }
});

router.post("/code", async (req,res) => {
  console.log("we hit router post code")
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
    // res.json(code);
    res.send({ msg: 'sent' })
    console.log(code)
    mailCode({ code, email })
  }catch(e){
    res.sendStatus(500);
  }
});

router.get("/", async (req,res) =>{
  try{
    console.log("we hit router get /");
    const email = req.query.email;
    const user = await userData.getByUserEmail(email);
    res.json(user);
  }catch(e){
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userData.getById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(404).json({ message: "not found!" });
  }
});

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