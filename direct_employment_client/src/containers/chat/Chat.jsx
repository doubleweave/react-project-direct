import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    List,
    Grow,
    ListItem,
	Avatar,
    Paper, 
    IconButton,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {sendMsg, readMsg, getUser} from '../../reducers/actions';
import ChatBotoomInput from './ChatBottomInput';
import ChatEmojiList from './ChatEmojiList';
import classNames from 'classnames';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = (theme) => ({
    page: {
        width: '100%',
        minheight: '100vh',
        display: 'flex',
        flex: 1,
        justifyDirection: 'column',
        justifyContent: 'space-between',
    },
    top: {
        width: '100%',
    },
    bottom: {
        position: 'fixed',
        bottom: 0,
    },
    header: {
        width: '100%',
        position: 'sticky',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute',
        left: 0,
        marginLeft: theme.spacing(1),
        color: '#fff',
    },
    counterpart_name: {},
    chatBox: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        marginBottom: '45px',
        background: '#dcdcdc',
    },
    chatBox_showingEmoji: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        marginBottom: '245px',
        background: '#dcdcdc',
    },
    owner_box: {
        flexDirection: 'row-reverse',
    },
    avatar: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    counter_paper: {
        padding: '5px',
        backgroundColor: 'primary',
    },
    paper: {
        padding: '5px',
    },
});

class Chat extends Component {

    state = {
        content: '',
        isShow: false, // Show Grid of emoji
        listClass: this.props.classes.chatBox,
        checked: false,
    };

    onChange = (name, value) => {
        this.setState({[name]: value});
    };

    onSubmit = () => {
        const from = this.props.user._id;
        const to = this.props.match.params.userId;
        const content = this.state.content.trim();
        if (content) {
            this.props.sendMsg({from, to, content});
        }
        this.setState({content: '', isShow: false});
        this.onHideEmoji();
    };

    onShowEmoji = () => {
        let isShow = this.state.isShow;
        isShow = !isShow;
        this.setState({isShow});
        let {listClass} = this.state;
        if (listClass === this.props.classes.chatBox) {
            this.setState({listClass: this.props.classes.chatBox_showingEmoji});
        } else {
            this.setState({listClass: this.props.classes.chatBox});
        }
    };

    onHideEmoji = () => {
        this.setState({isShow: false});
        let {listClass} = this.state;
        if (listClass === this.props.classes.chatBox_showingEmoji) {
            this.setState({listClass: this.props.classes.chatBox});
        }
    };

    onEmojiClick = (emoji) => {
        this.setState({content: this.state.content + emoji});
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    /*
    * Scroll to bottom of list
    * */

    listRef = React.createRef();

    focus = () => {
        const targetEle = this.listRef.current;
        if (targetEle) {
            document.documentElement.scrollTop = targetEle.scrollHeight;
        }
    };

    componentDidMount() {
        let listRef = this.listRef;
        if (listRef) {
            this.focus();
        }

        this.setState({checked: true});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.content !== prevState.content) {
            return;
        }
        this.focus();
    };

    componentWillUnmount() {
        const to = this.props.user._id;
        const from = this.props.match.params.userId;
        this.props.readMsg(from, to);
    };

    render() {
        const {classes, user} = this.props;
        const {users, chatMsgs} = this.props.chat;

        if (!users[user._id]) {
            return null;
        }

        const targetID = this.props.match.params.userId;
        const currentChatId = [user._id, targetID].sort().join('_');

        const msgs = chatMsgs.filter(msg => msg.chat_id === currentChatId);

        const myUser = users[user._id];
        const targetUser = users[targetID];

        return (
            <Fragment>
                <div className={classes.page}>
                    <div className={classes.top}>
                        <AppBar className={classes.header}>
                            <IconButton
                                className={classes.menuButton}
                                aria-label="back"
                                onClick={this.handleBack}
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            <Toolbar className={classes.counterpart_name}>
                                <Typography variant='h6'>{targetUser ? targetUser.username : null}</Typography>
                            </Toolbar>
                        </AppBar>
                        <List
                            className={classNames(this.state.listClass)}
                            ref={this.listRef}
                        >
                            {
                                msgs.map((msg, index) => {
                                    if (user._id === msg.to) {
                                        return (
                                            <Grow
                                                key={index}
                                                in={this.state.checked}

                                                {...(this.state.checked ? { timeout: 1000 * 0.5} : {})}
                                            >
                                                <ListItem

                                                >
                                                    <Avatar
                                                        alt="Remy Sharp"
                                                        src={`/static/images/avatar/${targetUser ? targetUser.avatar : null}.jpg`}
                                                        className={classes.avatar}
                                                    />
                                                    <Paper
                                                        className={classes.counter_paper}
                                                    >
                                                        <Typography variant='h5'>{msg.content}</Typography>
                                                    </Paper>
                                                </ListItem>
                                            </Grow>
                                        );
                                    } else {
                                        return (
                                            <Grow
                                                in={this.state.checked}

                                                {...(this.state.checked ? { timeout: 1000 * 0.5 } : {})}
                                                key={index}
                                            >
                                                <ListItem

                                                    className={classes.owner_box}
                                                >
                                                    <Avatar
                                                        key={index}
                                                        alt="Remy Sharp"
                                                        src={`/static/images/avatar/${myUser ? myUser.avatar : null}.jpg`}
                                                        className={classes.avatar}
                                                    />
                                                    <Paper
                                                        className={classes.paper}
                                                    >
                                                        <Typography variant='h5'>
                                                            {msg.content}
                                                        </Typography>
                                                    </Paper>
                                                </ListItem>
                                            </Grow>
                                        );
                                    }
                                })
                            }
                        </List>              
                    </div>
                    <div className={classes.bottom}>
                        <ChatEmojiList
                            onEmojiClick={this.onEmojiClick}
                            isShow={this.state.isShow}
                        />
                        <ChatBotoomInput
                            content={this.state.content}
                            onShowEmoji={this.onShowEmoji}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            onHideEmoji={this.onHideEmoji}
                        />
                    </div>
                </div>
                
            </Fragment>
        );
    };
}

export default connect(
    state => ({
        chat: state.chat,
        user: state.user,
    }),
    {sendMsg, readMsg, getUser}
)(withStyles(styles)(Chat));
