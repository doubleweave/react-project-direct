import {combineReducers} from 'redux';

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG, MSG_READ,
} from './action-types';

import {getRedirectTo} from '../utils';

const initUser = {
    username: '',
    userType: '',
    msg: '',
    redirectTo: ''
};

//User state
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:  // data is user:{}
            return {...action.data, redirectTo: getRedirectTo(action.data.userType, action.data.avatar)};
        case ERROR_MSG: // data is msg: ''
            return {...state, msg: action.data};
        case RECEIVE_USER: // data is user
            return action.data;
        case RESET_USER: // data is msg
            return {...initUser, msg: action.data};
        default:
            return state;
    }
}


const initUserList = [];

function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST: // data is: userList
            return action.data;
        default:
            return state;
    }
}

const initChat = {
    users: {}, // All users info: {userId: {username, avatar}}
    chatMsgs: [], // All message relate to current user.
    unReadCount: 0, // Number of all unread messages.
};

function chat(state = initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:  // data: {users, chatMsgs}
        {
            const {users, chatMsgs, userId} = action.data;
						let unReadCount = chatMsgs.reduce((preTotal, msg) => {
							console.log('in reducers, preTotal', preTotal);
							console.log('in reducers, msg.read', msg.read);
							console.log('in reducers, msg.to',msg.to);
							console.log('in reducers, userId',userId);
							console.log('in reducers,  msg.to === userId',  msg.to === userId);
							preTotal += (!msg.read && msg.to === userId ? 1 : 0);
							return preTotal;
						}, 0);
						console.log("in reducers, chatMsgs:", chatMsgs);
						console.log("in reducers, unReadCount:", unReadCount);
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userId ? 1 : 0), 0),
                // unReadCount: 0,
            };
        }
        case RECEIVE_MSG: {
            const {chatMsg, userId} = action.data;
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === userId ? 1 : 0),
                // unReadCount: 0,
            };
        }
        case MSG_READ: {
            const {count, from, to} = action.data;
            console.log('Result in reducers: count, from, to', count, from, to);
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    console.log('msg.from:',msg.from);
                    console.log('msg.to:',msg.to);
                    console.log('msg.read:',msg.read);
                    console.log('from:',from);
                    console.log('to:',to);
                    if(msg.from === from && msg.to === to && !msg.read) {
                        return {...msg, read: true};
                    } else {
                        return msg;
                    }
                }),
                unReadCount: state.unReadCount - count,
            };
        }
        default:
            return state;
    }
}

export default combineReducers({
    user,
    userList,
    chat,
});
// export {user: {}, userlist: {}, chat: {}}
