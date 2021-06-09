import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg,
} from '../api/index'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ,
} from "./action-types";
import io from 'socket.io-client';

// sync: auth successful
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
// sync: error message
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});

const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

export const resetUser = (msg) => ({type: RESET_USER, data: msg});

const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});

const receiveMsgList = ({users, chatMsgs, userId}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userId}});

const receiveMsg = ({chatMsg, userId}) => ({type:RECEIVE_MSG, data: {chatMsg, userId}});

const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}});

//async login
export const login = (user) => {
	console.log('In actions, login');
    const {username, password} = user;
    // sync form check action
    if(!username) {
        return errorMsg('Username is required.');
    } else if(!password) {
        return errorMsg('Please enter password.')
    }

    return async dispatch => {
        //send req to server
        const response = await reqLogin(user);   // {code: 0/1, user: {}, msg: ''}
        const result = response.data;
				
        if(result.code === 0) { //success
            getMsgList(dispatch, result.data._id);
						console.log("in actions -> login, result.data._id", result.data._id);
            dispatch(authSuccess(result.data));
        } else { //failed
            dispatch(errorMsg(result.msg));
        }
    }
};

//async register
export const register = (user) => {
	console.log('In actions, register');
    const {username, password, userType, confirm_psw} = user;
    // sync form check action
    if(!username) {
        return errorMsg('Username is required.');
    } else if(!password) {
        return errorMsg('Please enter password.')
    } else if(password !== confirm_psw) { // return sync errorMsg action
        return errorMsg('Password should be the same.');
    }

    // async ajax action
    return async dispatch => {
        //send req to server
        const response = await reqRegister({username, password, userType});   // {code: 0/1, user: {}, msg: ''}
        const result = response.data;
        if(result.code === 0) { //success
            getMsgList(dispatch, user._id);
						console.log('Frontend, in actions, register, res:', result.data);
            dispatch(authSuccess(result.data));
        } else { //failed
            dispatch(errorMsg(result.msg));
        }
    }
};

//async update
export const updateUser = (user) => {
	console.log('In actions, updateUser');
      return async dispatch => {
          const response = await reqUpdateUser(user);
          const result = response.data;
          if(result.code === 0) { // success, data: {}
                dispatch(receiveUser(result.data));
          } else {  // failed, msg:''
                dispatch(resetUser(result.msg));
          }
      };
};

//async get user
export const getUser = () => {
	console.log('In actions, getUser');
    return async dispatch => {
        const response = await reqUser();
        const result = response.data;
        if(result.code === 0) {
            getMsgList(dispatch, result.user._id);
            dispatch(receiveUser(result.user));
        }else {
            dispatch(resetUser(result.msg));
        }
    };
};

export const getUserList = (userType) => {
	console.log('In actions, getUserList');
    if(!userType) {
        return errorMsg('No userType, get User List failed.');
    }
    return async dispatch => {
        const response = await reqUserList(userType);
        const result = response.data;
        if(result.code === 0) {
            dispatch(receiveUserList(result.data));
        }
    };
};

function initIO(dispatch, userId) {
	console.log('In actions, initIO');
    io.socket = io('ws://localhost:4000',{'forceNew':true });
    
    // if(!io.socket) {
    //     // io.socket = io('ws://localhost:4000');
    //     io.socket = io('ws://localhost:4000',{'forceNew':true });
    //     // io.socket = io('ws://172.22.0.3:4000');
    //     // io.socket = io('ws://direct_server:4000');
    // }

    io.socket.on('receiveMsg', function(chatMsg) {
        console.log('Client receive message from server', chatMsg);
        console.log('userId, from, to', userId, chatMsg.from, chatMsg.to);
        if(userId === chatMsg.from || userId === chatMsg.to) {
            dispatch(receiveMsg({chatMsg, userId}));
        }
    });
}

export const sendMsg = ({from, to, content}) => {
	console.log('In actions, sendMsg');
    return dispatch => {
        console.log('sending message:', {from, to, content});
        io.socket.emit('sendMsg', {from, to, content});

    };
};

export const disconnected = (() => {
    return dispatch => {
        if(io.socket) {
            console.log("！！！！！！！！！！！！client disconnected from server！！！！");
            io.socket.emit('end');
        }
    };
});

// async get Message List
async function getMsgList(dispatch, userId) {
	console.log('In actions, getMsgList userId', userId);
    initIO(dispatch, userId);
    const response = await reqChatMsgList();
    const result = response.data;
    if(result.code === 0) {
        const {users, chatMsgs} = result.data;
		console.log('In actions -> getMsgList, users and chatMsgs', users, chatMsgs);

        dispatch(receiveMsgList({users, chatMsgs, userId}));
    }
}

export const readMsg = (from, to) => {
	console.log('In actions, readMsg');
    return async dispatch => {
        const response = await reqReadMsg(from);
        const result = response.data;
        console.log('In actions.js, from, to:', from, to);
        console.log('In actions.js, result:', result);
        if(result.code === 0) {
            const count = result.data;
            console.log('In actions.js, number of unread has been changed:', count);
            dispatch(msgRead({count, from, to}));
        }
    };
};
