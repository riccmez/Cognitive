const router = require('express').Router();
const messages = require('../controllers/msgController')
const {isLoggedIn, isNotLoggedIn} = require('../lib/profile')
const user = require('../models/Usuarios');
const path = require('path');


router.get('/',isNotLoggedIn,(req, res) => {
  res.render('pages/user/index');
});

router.get('/register',isNotLoggedIn, (req, res) => {
  res.render('pages/logreg/Signup');
});

router.get('/user',isLoggedIn,(req,res)=>{
  res.render('pages/user/user')
})

router.get('/CustomerService',isLoggedIn,(req,res)=>{
  res.render('pages/user/customerService')
})

router.get('/admin',isLoggedIn, (req, res) => {
  let id = req.user._conditions._id;
  user.findById(id).exec(async (err,result)=>{
    if(err) console.error(err);
    if(result.root == 'no')
      res.send('Credentials not valid')
    else
      res.render('pages/admin/index');
    
  })
});

router.post('/SendMsg',messages.create)

router.get('/Logout', isLoggedIn ,(req,res) =>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

module.exports = router;
