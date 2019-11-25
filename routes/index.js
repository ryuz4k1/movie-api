const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>  {
    const user = new User({
      username,
      password: hash
    });
  
    user.save().then((data) => {
      res.send(data)
    }).catch((err) => {
      res.send(err)
    });
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    username: username
  }, (err, user) => {
    if (err)
      throw err;

    if(!user){
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{
      //ilk parametre, servisten gelen, ikincisi dbdeki password karşılaştırma
      bcrypt.compare(password, user.password).then((result) => {
        if (!result){
          res.json({
            status: false,
            message: 'Authentication failed, wrong password.'
          });
        }else{
          const payload = {
            username
          };
          //Token üretiyoruz, ilk parametre payload kısmı, ikincisi ise secret key
          //3. parametre ise belli bir zaman verebiliyoruz, 720dakika yani 12 saat sürecek bir tokenin süresi sonrasında destroy
          const token = jwt.sign(payload, req.app.get('apiKey'), {
            expiresIn: 720 // 12 saat
          });
          res.json({
            status: true,
            token
          });
        };
      });
    };
  });
});

module.exports = router;
