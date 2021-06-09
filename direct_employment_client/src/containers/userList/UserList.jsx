import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Typography,
    Slide,
} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import {connect} from 'react-redux';
import {getUserList} from '../../reducers/actions';
import {withRouter} from 'react-router-dom';

const styles = (theme) => ({
    root: {
        marginBottom: '56px',
        backgroundColor: '#dcdcdc',
    },
    card: {
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        background: '#566e92',
        margin: '10px 0',
    },
});

class UserList extends Component {

    static propTypes = {
        userList: PropTypes.array.isRequired,
    };

    componentDidMount() {
        let {userType} = this.props.user;
        userType = userType === 'employer' ? 'employee' : 'employer';
        this.props.getUserList(userType);

        this.setState({checked: true});
    }

    state = {
        checked: false,
    };

    render() {
        const {classes, userList} = this.props;
        console.log('userList', userList);
        return (
            <div className={classes.root}>
                {
                    userList !== []
                    &&
                    userList.map((userItem, index) => {
                        let avatarSrc = '';
                        if (userItem.avatar) {
                            avatarSrc = `/static/images/avatar/${userItem.avatar}.jpg`;
                        }
                        return (
                            <Slide
                                in={this.state.checked}
                                direction="left"
                                mountOnEnter unmountOnExit
                                {...(this.state.checked ? { timeout: 1000 * 0.5 * index > 1500 ? 1500 : 1000 * 0.5 * index } : {})}
                                key={userItem._id}
                            >
                                <Card
                                    className={classes.card}
                                    onClick={() => this.props.history.push(`/chat/${userItem._id}`)}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                alt={userItem.username}
                                                src={avatarSrc}
                                                className={classes.large}
                                            />
                                        }
                                        title={userItem.username}
                                        subheader={userItem.organization}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="h5">
                                            recruitment: {userItem.recruitment}
                                        </Typography>
                                        <Typography variant="h6" component="h5">
                                            info: {userItem.info}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Slide>
                        );
                    })
                }
            </div>
        );
    };
};

export default connect(
    state => ({
        user: state.user,
        userList: state.userList,
    }),
    {getUserList}
)(withRouter(withStyles(styles)(UserList)));

