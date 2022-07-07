const router = require('express').Router();
const Msg = require('../models/Msg');
var messages = {};



messages.create = (req,res)=>{
    // const msg = timeago(new Date()).toString();
    var newMsg = new Msg({
        email: req.body.email,
        content: req.body.content,
        time: Date.now()
    })
    newMsg.save((error)=>{
        if(error)
            req.flash('message','Hubo un error enviando su mensaje')
        else
            req.flash('success','Su mensaje fue enviado');
        res.redirect('/CustomerService')
    }) 
}

module.exports = messages;