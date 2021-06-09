var express = require('express');

var router = express.Router();
const {UserModel, ChatModel} = require('../db/models');
const md5 = require('blueimp-md5');
const filter = {password: 0, __v: 0};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/register', function (req, res, next) {
    const {username, password, userType} = req.body;
    // console.log(username, password, userType);
    UserModel.findOne({username}, function (err, user) {
        if (user) {
            res.send({code: 1, msg: 'User already exists.'});
        } else {
            // console.log({username, password, userType});
            new UserModel({username, password: md5(password), userType}).save((err, user) => {
                res.cookie('userId', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
                const data = {username, userType, _id: user._id};
                res.send({code: 0, data});
                // console.log(err, user);
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    const {username, password} = req.body;
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        if (user) {
            res.cookie('userId', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
            res.send({code: 0, data: user});
        } else {
            res.send({code: 1, msg: 'Username or password do not match.'});
        }
    })
});

router.post('/update', function (req, res, next) {
    const userId = req.cookies.userId;
    if (!userId) {
        return res.send({code: 1, msg: 'Please login first.'});
    }
    const user = req.body;
    // console.log(user);
    UserModel.findByIdAndUpdate({_id: userId}, user, function (err, oldUser) {
        if (!oldUser) {
            res.clearCookie('userId');
            return res.send({code: 1, msg: 'Please login first.'});
        }

        const {_id, username, userType} = oldUser;

        const data = Object.assign(user, {_id, username, userType});

        res.send({code: 0, data});
    });
});

router.get('/user', function (req, res, next) {
    const userId = req.cookies.userId;
    if (!userId) {
        return res.send({code: 1, msg: 'Please login first.'});
    }
    UserModel.findOne({_id: userId}, filter, function (err, user) {
        res.send({code: 0, user});
    });
});

router.get('/userlist', function (req, res, next) {
    const {userType} = req.query;
    // console.log(userType);
    if (!userType) {
        return res.send({code: 1, msg: 'No user type info.'})
    }
    UserModel.find({userType}, filter, function (error, users) {
        res.send({code: 0, data: users});
    });
});

router.get('/msglist', function(req, res){
    const userId = req.cookies.userId;

    UserModel.find(function(err, userDocs){

        const users = userDocs.reduce((users, doc) => {
            users[doc._id] = {username: doc.username, avatar: doc.avatar};
            return users;
        },{});

        ChatModel.find({'$or': [{from: userId}, {to: userId}]}, function(err, chatMsgs) {
            // console.log('users and chatMsgs', users, chatMsgs);

            res.send({code: 0, data: {users, chatMsgs}});
        });
    });
});

router.post('/readmsg', function(req, res) {
    console.log('Backend, /readmsg, req.body', req.body);
    const from = req.body.from;
    const to = req.cookies.userId;
    console.log('Backend, /readmsg, from', from);
    console.log('Backend, /readmsg, to', to);
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(err,doc){
        console.log('Backend, /readmsg, doc', doc);
        console.log('Backend, /readmsg, err', err);
        res.send({code: 0, data: doc.nModified});
    });
});


module.exports = router;
