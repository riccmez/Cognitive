const router = require('express').Router();
const Msg = require('../models/Msg');
var messages = {};



messages.create = (req, res) => {
    var newMsg = new Msg({
        title: req.body.title,
        content: req.body.content,
        email: req.body.email,
        time: Date.now()
    })
    newMsg.save((error) => {
        if (error)
            req.flash('message', 'Hubo un error enviando su mensaje')
        else
            req.flash('success', 'Su mensaje fue enviado');
        res.redirect('/CustomerService')
    })
}

module.exports = messages;