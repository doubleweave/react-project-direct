const mongoose = require('mongoose');

// const server = '127.0.0.1:27017';   //local and deploy
const server = 'localhost:27017';    //docker
const database = 'direct_test';

mongoose.connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection successful.');
}).catch((err) => {
    console.log(`error: ${err}`);
});

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, required: true},
    avatar: {type: String},
    post: {type: String},
    info: {type: String},
    organization: {type: String},
    salary: {type: String},
    recruitment: {type: String},
    __v: {type: Number},
});

const UserModel = mongoose.model('user', userSchema); // define collection name as users.

exports.UserModel = UserModel;

// Collection chats
const chatSchema = mongoose.Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
    chat_id: {type: String, required: true}, //combined by 'from' and 'to
    content: {type: String, required: true},
    read: {type: Boolean, default: false},
    create_time: {type: Number},
});

const ChatModel = mongoose.model('chat', chatSchema);// collection name: chats

exports.ChatModel = ChatModel;
