const router = require('express').Router();
const messages = require('../controllers/msgController')
const {isLoggedIn, isNotLoggedIn} = require('../lib/profile')
const user = require('../models/Usuarios');
const msgs = require('../models/Msg')
const request = require('../models/requests')
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

function format_date(date = new Date()){
  let fecha_hora = (date.getFullYear()).toString();
  if(date.getMonth() <10)
  fecha_hora += '-'+'0'+ (date.getMonth()+1).toString();
  else
    fecha_hora += '-'+(date.getMonth()+1).toString();
  if(date.getDay() <10)
    fecha_hora += '-0'+(date.getDate()).toString();
  else
  fecha_hora += '-'+(date.getDate()).toString();
  return fecha_hora;
}

router.get('/admin',isLoggedIn, (req, res) => {
  let id = req.user._conditions._id;
  user.findById(id).exec(async (err,result)=>{
    if(err) console.error(err);
    if(result.root == 'no')
    res.send('Credentials not valid')
    else{
      msgs.find((err,result)=>{
        if(err)console.error(err)
        var date =  format_date(new Date());
        request.find({time:{$gte:date}}).exec((er,entry)=>{
          if(err) console.error(err);
          res.render('pages/admin/index',{msgs:result.length,requests:entry.length});
        })
      })

    }
  })
});

router.get('/Stats',isLoggedIn,(req, res) => {
  res.render('pages/admin/stats')
})

router.get('/Clients',isLoggedIn,(req, res) => {
  let id = req.user._conditions._id;
  user.findById(id).exec(async (err,result)=>{
    if(err) console.error(err);
    if(result.root == 'no')
    res.send('Credentials not valid')
    else{
      msgs.find((err,result)=>{
        if(err)console.error(err)
        var date =  format_date(new Date());
        request.find({time:{$gte:date}}).exec((er,entry)=>{
          if(err) console.error(err);
          user.find((e,clt)=>{
            res.render('pages/admin/clients',{clt:clt.length,msgs:result.length,requests:entry.length});
          })
        })
      })

    }
  })
})

router.post('/SendMsg',messages.create)

router.get('/Logout', isLoggedIn ,(req,res) =>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

module.exports = router;
