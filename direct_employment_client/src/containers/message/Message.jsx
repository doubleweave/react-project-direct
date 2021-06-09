/*
* Message page - Router container page
* */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Badge,
    IconButton,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {withStyles} from '@material-ui/core/styles';
import {getUser} from '../../reducers/actions';

const styles = (theme) => ({
    messageList: {
        marginBottom: '45px',
        backgroundColor: '#dcdcdc',
    },
});

function getLast(chatMsgs, userID) {
    let lastMsgObjs = {};

    chatMsgs.forEach(msg => {
        if(msg.to === userID && !msg.read) {
            msg.unReadCount = 1;
        } else {
            msg.unReadCount = 0;
        }

        const chatId = msg.chat_id;
        const lastMsg = lastMsgObjs[chatId];
        if (!lastMsg) {
            lastMsgObjs[chatId] = msg;
        } else {
            const unReadCount = lastMsgObjs[chatId].unReadCount + msg.unReadCount;
            if (lastMsg.create_time < msg.create_time) {
                lastMsgObjs[chatId] = msg;
            }
            lastMsgObjs[chatId].unReadCount = unReadCount;
        }
    });

    const lastMsgs = Object.values(lastMsgObjs);

    lastMsgs.sort(function (lastMsg1, lastMsg2) {
        return lastMsg2.create_time - lastMsg1.create_time;
    });

    return lastMsgs;

}

class Message extends Component {

		state = {
			users: [],
		};

		refreshPage = () => {
			window.location.reload(false);
		}

    render() {
				
        const {classes, user} = this.props;
        const {users, chatMsgs} = this.props.chat;
        console.log('users', users);
        console.log('chatMsgs', chatMsgs);
        const lastMsgs = getLast(chatMsgs, user._id);

        console.log('lastMsgs', lastMsgs);

        return (
            <Fragment>
                <div className={classes.root}>
                    <List
                        className={classes.messageList}
                    >
                        {
                            lastMsgs.map(msg => {
                                const counterpartUserID = msg.to === user._id? msg.from : msg.to;
                                const counterpartUser = users[counterpartUserID];
                                if(!counterpartUser) {
                                    this.refreshPage();
                                }
                                console.log(counterpartUser);
                                return (
                                    <ListItem
                                        key={counterpartUser.username}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="username" src={
                                                counterpartUser.avatar
                                                    ?
                                                    `/static/images/avatar/${counterpartUser.avatar}.jpg`
                                                    :
                                                    null
                                            }/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={msg.content}
                                            secondary={
                                                <Fragment>
                                                    <Typography component={'span'} variant={'body2'}>
                                                        {counterpartUser.username}
                                                    </Typography>
                                                </Fragment>
                                            }
                                        />
                                        <Badge
                                            badgeContent={msg.unReadCount}
                                            color="secondary"
                                        >
                                        </Badge>
                                        <IconButton
                                            onClick={() => {this.props.history.push(`/chat/${counterpartUserID}`)}}
                                        >
                                            <ArrowForwardIcon fontSize='large'/>
                                        </IconButton>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </div>
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat,
    }),
    {getUser}
)(withStyles(styles)(Message));
