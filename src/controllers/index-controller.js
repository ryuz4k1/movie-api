const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');


class IndexController {

	constructor(router) {
        this.router = router;
        this.routes();
    }

    async index(req, res, next) {
        try {
            return res.render("./index.jade", { title: 'Express'});
            next();
        } 
        catch (error) {
           console.log(error);
        }
    }

    async register(req, res) {
        try {
          req.body.password = await bcrypt.hash(req.body.password, 10);

          const user = await User.create({
            username: req.body.username,
            password: req.body.password
          });
          return res.send(user);
        }
        catch (error) {
            console.log(error);
        }
    }

    async authenticate(req, res, next) {
      try {
        const { username, password } = req.body;
        await User.findOne({
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
      } 
      catch (error) {
        console.log(error);
      }
    }

	routes() {
        this.router.get("/", this.index.bind(this));
        this.router.post("/register", this.register.bind(this));
        this.router.post("/authenticate", this.authenticate.bind(this));
    }
}


module.exports = IndexController;