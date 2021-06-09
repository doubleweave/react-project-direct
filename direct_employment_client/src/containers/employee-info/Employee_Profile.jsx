/*
* Router container component of Employee Info
* */

import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    Card,
    List,
    ListItem,
    TextField,
    Button,
		Dialog,
		DialogTitle,
    DialogActions,
} from '@material-ui/core';
import {
    withStyles,
} from '@material-ui/core/styles';
import AvatarSelector from '../../components/avatarSelector/AvatarSelector';
import {updateUser} from '../../reducers/actions';
import {Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import {resetUser} from '../../reducers/actions';

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        flexShrink: 1,
    },
    headerBar: {
        width: '100%',
        textAlign: 'center',
    },
    submitButton: {
        fontSize: '1em',
        marginTop: '5px',
    },
};

class Employee_Profile extends Component {

    state = {
        recruitment: '',
        info: '',
        avatar: '',
				open: false,
    };

    setAvatar = (avatar) => {
        this.setState({
            avatar
        });
    };

    handleChange = (name) => (event) => {
        this.setState({
            [name]: event.target.value,
        })
    };

		handleOpen = () => {
			this.setState({open: true});
		};
		handleClose = () => {
				this.setState({open: false});
		};

    handleSubmit = () => {
        this.props.updateUser(this.state);
        // Cookies.remove('userId');
        // this.props.resetUser();
    };

    render() {
        const {classes} = this.props;
        const {avatar} = this.props.user;

        if(avatar) {
            // const path = userType === 'employee' ? '/employee' : '/employer';
			return <Redirect to={'/login'} />
        }

        return (
            <Fragment>
                <div className={classes.page}>
                    <div className={classes.top}>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" className={classes.headerBar}>
                                    Employee Info
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <AvatarSelector setAvatar={this.setAvatar}/>
                        <Card>
                            <List component="nav" aria-label="main mailbox folders">
                                <ListItem alignItems="flex-start">
                                    <TextField
                                        id="recruitment"
                                        label="Job objective:"
                                        variant="outlined"
                                        fullWidth
                                        onChange={this.handleChange("recruitment")}
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <TextField
                                        multiline
                                        rowsMax={4}
                                        id="info"
                                        label="Self introduction:"
                                        variant="outlined"
                                        fullWidth
                                        onChange={this.handleChange("info")}
                                    />
                                </ListItem>
                            </List>
                        </Card>
                    </div>
                    <div className={classes.bottom}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            className={classes.submitButton}
                            onClick={this.handleOpen}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Registration Successful. Please Login"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    };
}

export default connect(
    state => ({user: state.user}),
    {updateUser, resetUser},
)(withStyles(styles)(Employee_Profile));
