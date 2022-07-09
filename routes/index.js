const router = require('express').Router();
const messages = require('../controllers/msgController')
const { isLoggedIn, isNotLoggedIn } = require('../lib/profile')
const user = require('../models/Usuarios');
const msgs = require('../models/Msg')
const request = require('../models/requests')
const path = require('path');

const { format, register } = require('timeago.js')
var nodemailer = require('nodemailer');

register('es_ES', (number, index, total_sec) => [
    ['justo ahora', 'ahora mismo'],
    ['hace %s segundos', 'en %s segundos'],
    ['hace 1 minuto', 'en 1 minuto'],
    ['hace %s minutos', 'en %s minutos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'in %s horas'],
    ['hace 1 dia', 'en 1 dia'],
    ['hace %s dias', 'en %s dias'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['hace %s meses', 'en %s meses'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años']
][index]);

const timeago = timestamp => format(timestamp, 'es_ES');
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'sebastian.grandaa@gmail.com',
        pass: 'ptpnergjmjqnnqqq',
    },
    secure: true,
});

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('pages/user/index');
});


router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('pages/logreg/Signup');
});

router.get('/user', isLoggedIn, (req, res) => {
    res.render('pages/user/user')
})

router.get('/CustomerService', isLoggedIn, (req, res) => {
    res.render('pages/user/customerService')
})

function format_date(date = new Date()) {
    let fecha_hora = (date.getFullYear()).toString();
    if (date.getMonth() < 10)
        fecha_hora += '-' + '0' + (date.getMonth() + 1).toString();
    else
        fecha_hora += '-' + (date.getMonth() + 1).toString();
    if (date.getDay() < 10)
        fecha_hora += '-0' + (date.getDate()).toString();
    else
        fecha_hora += '-' + (date.getDate()).toString();
    return fecha_hora;
}

router.get('/admin', isLoggedIn, (req, res) => {
    let id = req.user._conditions._id;
    user.findById(id).exec(async(err, result) => {
        if (err) console.error(err);
        if (result.root == 'no')
            res.send('Credentials not valid')
        else {
            msgs.find((err, result) => {
                if (err) console.error(err)
                var date = format_date(new Date());
                request.find({ time: { $gte: date } }).exec((er, entry) => {
                    if (err) console.error(err);
                    res.render('pages/admin/index', { msgs: result.length, requests: entry.length });
                })
            })

        }
    })
});

router.get('/Stats', isLoggedIn, (req, res) => {
    res.render('pages/admin/stats')
})

router.get('/Clients', isLoggedIn, (req, res) => {
    let id = req.user._conditions._id;
    user.findById(id).exec(async(err, result) => {
        if (err) console.error(err);
        if (result.root == 'no')
            res.send('Credentials not valid')
        else {
            msgs.find((err, result) => {
                if (err) console.error(err)
                let timeStamp = [];
                for (var i = 0; i < result.length; i++) {
                    timeStamp[i] = timeago(result[i].time).toString();
                }
                var date = format_date(new Date());
                request.find({ time: { $gte: date } }).exec((er, entry) => {
                    if (err) console.error(err);
                    user.find((e, clt) => {
                        res.render('pages/admin/clients', { clt: clt.length, msgs: result.length, requests: entry.length, msg: result, timeStp: timeStamp });
                    })
                })
            })

        }
    })
})

router.post('/SendMsg', messages.create)

router.post('/Res/:id', (req, res) => {
    let id = req.user._conditions._id;
    user.findById(id).exec(async(err, result) => {
        if (err) console.error(err);
        if (result.root == 'no')
            res.send('Credentials are invalid.')
        else {
            msgs.findById(req.params.id).exec((err, result) => {
                let message = {
                    from: 'sebastian.grandaa@gmail.com',
                    to: result.email,
                    subject: 'En respuesta a: ' + result.title,
                    text: req.body.response,
                };
                console.log(message);
                transporter.sendMail(message, function(err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
                msgs.deleteOne({ title: result.title }, function(err) {
                    if (err) console.error(err);
                });

            })
        }
    })
    res.render('pages/admin/stats');
})

router.get('/msgDet/:id', (req, res) => {
    let id = req.user._conditions._id;
    user.findById(id).exec(async(err, result) => {
        if (err) console.error(err);
        if (result.root == 'no')
            res.send('Credentials not valid')
        else {
            msgs.findById(req.params.id).exec((err, result) => {
                let detail = {
                    id: req.params.id,
                    email: result.email,
                    title: result.title,
                    content: result.content,
                    time: (result.time).toString(),
                    stamp: timeago(result.time).toString()
                }
                res.render('pages/admin/msgDetail', { detail })
            })
        }
    })
})

router.get('/Logout', isLoggedIn, (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

module.exports = router;