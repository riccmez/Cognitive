const router = require('express').Router();
const Msg = require('../models/Msg');
var messages = {};

messages.create = (req,res)=>{
    var newMsg = new Msg({
        email: req.body.email,
        content: req.body.content,
        time: new Date()
    })
    newMsg.save((error)=>{
        if(error)
            req.flash('message','Hubo un error enviando su mensaje')
        req.flash('success','Su mensaje fue enviado');
        res.redirect('/CustomerService')
    }) 
}

module.exports = messages;