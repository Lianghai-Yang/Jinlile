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
    if (!emailInfo) {
        res.status(400).json({ error: "You must provide email to create its code" });
        return;
    }
    
    if (!emailInfo.email) {
      res.status(400).json({ error: "You must provide an email" });
      return;
    }

    try{
      const email = emailInfo.email;
      const code = await userData.createCode(email);
      res.json(code);
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

router.post(`/code`, async (req, res, next) => {
  let { email } = req.body
  if (!email) {
    res.status(400).send({ msg: 'missing email' })
  }

  if (validator.isEmail(email) == false) {
    return res.status(400).send({ msg: 'invalid email' })
  }

  let code = 1234
  try {
    let info = await mailer.sendMail({
      from: '"Jinlile Team" <team@jinlile.tech>',
      to: email,
      subject: `Your Login Code is ${code}`,
      text: `Thank you for using Jinlile. Your login code is ${code}`
    })
    console.log('message sent')
    console.log(info)
  }
  catch(e) {
    return res.status(500).send(e.message)
  }

  res.send({ msg: 'Your code has been sent to you email' })
})

module.exports = router;
