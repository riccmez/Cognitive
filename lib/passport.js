const { use } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Usuarios')
const helpers = require('./helpers')

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback: true
},  async (req,email,password,done)=>{
    User.find({email:email}).exec(async (err,result)=>{
        if(err) throw err
        if(result == "")
            done(null,false,req.flash('message','No hay cuenta registrada con este correo'))
        const validPass = await helpers.matchPassword(password,result[0].password)
        if(validPass)
            done(null,result[0],req.flash('success','Hola'))
        else
            done(null,false,req.flash('message','Contraseña Incorrecta'))
    })
}))

passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req,username,password,done)=>{
    const {nombre,email,pass,contra} = req.body;
    User.find({email:email}).exec(async (err,result)=>{
        if(err) throw err;
        if(result == ""){
            if(password != contra)
                done(null,false,req.flash('message','Las contraseñas no coiciden'))
            else if(password.length < 9)
                done(null,false,req.flash('message','La contraseña es muy corta. Necesita mínimo 9 caracteres'))
            else{
                let EncryptedPassword = await helpers.encryptPassword(password);
                var newUser = new User({
                    nombre: nombre,
                    email: email,
                    password: EncryptedPassword,
                    root: "no"
                })
                newUser.save((error)=>{
                    if(error)
                        res.status(400).send('No se pudo registrar')
                })
                return done(null,false,req.flash('success','La cuenta se registró'))
            }
        }
        else
            done(null,false,req.flash('message','Ya existe un usuario con este correo'))
    })
}));

passport.serializeUser((user,done)=>{
    done(null,user._id);
})

passport.deserializeUser(async (id,done)=>{
    const rows = User.find({_id:id})
    done(null,rows);
});