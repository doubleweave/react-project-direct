/*
* Personal page - Router container page
* */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    List,
    ListItem,
    Dialog,
    Paper,
    ListSubheader,
    Typography,
    Avatar,
    Divider,
    Button,
    DialogTitle,
    DialogActions,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import {resetUser, disconnected} from '../../reducers/actions';

const styles = (theme) => ({
    root: {
        touchAction: 'pan-y',
    },
    ava_info: {
        display: 'flex',
        marginTop: '5px',
        flexDirection: 'column',
        alignItems: 'center',
    },
    name_info: {
        fontSize: '2em',
    },
    org_info: {
        fontSize: '1em',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    detail_info: {
        marginTop: '5px',
        marginBottom: '5px',
        backgroundColor: '#f5f5f5',
    },
});

class Personal extends Component {

    state = {
        open: false,

    };

    handleOpen = () => {
        this.setState({open: true});
    };
    handleClose = () => {
        this.setState({open: false});
    };

    handleLogout = () => {
        Cookies.remove('userId');
        this.props.resetUser();
        this.props.disconnected();
    };

    render() {
        const {user, classes} = this.props;
        const {avatar, username, organization, recruitment, info, salary} = user;
        return (
            <div className={classes.root}>
                <Paper className={classes.ava_info}>
                    <Avatar
                        alt="Remy Sharp"
                        src={`/static/images/avatar/${avatar}.jpg`}
                        className={classes.large}
                    />
                    <div className={classes.name_info}>{username}</div>
                    {
                        organization
                        &&
                        <div className={classes.org_info}>{organization}</div>
                    }
                </Paper>
                <Paper className={classes.detail_info}>
                    <List
                        subheader={
                            <ListSubheader>
                                <div>Information</div>
                            </ListSubheader>
                        }
                    >
                        <Divider/>
                        <ListItem>
                            <Typography>recruitment: {recruitment}</Typography>
                        </ListItem>
                        <Divider light/>
                        <ListItem>
                            <Typography>info: {info}</Typography>
                        </ListItem>

                        {
                            salary
                            &&
                            (
                                <Fragment>
                                    <Divider light/>
                                    <ListItem>
                                        <Typography> salary: {salary}</Typography>
                                    </ListItem>
                                </Fragment>
                            )
                        }
                    </List>
                </Paper>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={this.handleOpen}
                >
                    Logout
                </Button>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure to logout?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleLogout} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default connect(
    state => ({user: state.user}),
    {resetUser, disconnected}
)(withStyles(styles)(Personal));
