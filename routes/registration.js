const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/regNewUser', passport.authenticate('local.signup', {
    successRedirect: '/register',
    failureRedirect: '/register',
    failureFlash: true,
    successFlash: true
}))

router.post('/SignIn', passport.authenticate('local.signin', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true,
    successFlash: true
}))

module.exports = router;