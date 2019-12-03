const validator = require('validator')
var express = require('express');
var router = express.Router();
const mailer = require('../mailer')
// const validator = require('validator')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
