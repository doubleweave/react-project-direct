import React, {Fragment, Component} from 'react';
import Logo from '../../components/logo/Logo';
import {
    withStyles,
    TextField,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    AppBar,
    Toolbar,
    Typography,
    Card,
    List,
    ListItem,
    Divider,
    FormControl,
    Radio,
    Button,
} from "@material-ui/core";

import {connect} from 'react-redux';
import {register} from '../../reducers/actions';
import {Redirect} from 'react-router-dom';

const styles = theme => ({
    page: {
        [theme.breakpoints.up('xs')]: {
            width: '100%',
            height: '100vh',
            border: '1px yellow solid',
            margin: '0 auto',
        },
        [theme.breakpoints.between('sm', 'md')]: {
            width: '380px',
            height: '100vh',
            border: '1px red solid',
            margin: '0 auto',
        },
        [theme.breakpoints.between('md', 'lg')]: {
            width: '380px',
            height: '100vh',
            border: '1px green solid',
            margin: '0 auto',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        flexShrink: 1,
    },
    title: {
        width: '100%',
        textAlign: 'center',
    },
    logo: {
    },
    textRoot: {
        width: '100%',
    },
    textField: {
        width: '100%',
    },
    radioItem: {
        width: '100%',
        alignItems: 'initial',
    },
    spanItem: {
        marginLeft: 20,
    },
    submitButton: {
        marginTop: 5,
    },
    errMsg: {
        color: 'red',
        marginLeft: '1em',
    },
});


class Register extends Component {

    state = {
        username: '',
        password: '',
        confirm_psw: '',
        userType: 'employee',
    };

    handleChange = (name) => (event) => {
      this.setState({[name]: event.target.value});
    };

    handleSubmit = () => {
        this.props.register(this.state);
    };

    toLoginPage = () => {
        const {history} = this.props;
        console.log(history);
        history.replace('login');
    };

    render() {
        const {classes} = this.props;
        const {msg, redirectTo} = this.props.user;

        if(redirectTo) {
            return <Redirect to={redirectTo} />
        }

        return (
            <Fragment>
                <div className={classes.page}>
                    <div className={classes.top}>
                        <AppBar position="static">
                                <Toolbar>
                                    <Typography variant="h5" className={classes.title}>
                                        Direct employment
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                        
                            <div>
                                <Logo
                                    className={classes.logo}
                                />
                            </div>
                            <Card>
                                <List className={classes.textRoot}>
                                    {msg ? <div className={classes.errMsg}>{msg}</div>: null}
                                    <ListItem alignItems="flex-start">
                                        <TextField
                                            placeholder="Please enter user name"
                                            id="username"
                                            label="username:"
                                            variant="outlined"
                                            className={classes.textField}
                                            value={this.state.username}
                                            onChange={this.handleChange('username')}
                                        />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems="flex-start">
                                        <TextField
                                            placeholder="Please enter 6 digits password"
                                            id="password"
                                            label="Password:"
                                            variant="outlined"
                                            className={classes.textField}
                                            type='password'
                                            onChange={this.handleChange('password')}
                                        />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems="flex-start">
                                        <TextField
                                            placeholder="Please retype your password"
                                            id="confirm_psw"
                                            label="Confirm:"
                                            variant="outlined"
                                            className={classes.textField}
                                            type='password'
                                            onChange={this.handleChange('confirm_psw')}
                                        />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem alignItems="flex-start"  className={classes.radioItem}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">User Type:</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-label="quiz"
                                                name="quiz"
                                                onChange={this.handleChange('userType')}
                                                value={this.state.userType}
                                            >
                                                <FormControlLabel
                                                    className={classes.spanItem}
                                                    value="employee"
                                                    control={<Radio />}
                                                    label="employee"
                                                    labelPlacement="start"
                                                />
                                                <FormControlLabel className={classes.spanItem} value="employer" control={<Radio />} label="employer" labelPlacement="start"/>
                                            </RadioGroup>
                                        </FormControl>
                                    </ListItem>
                                </List>
                            </Card>
                    </div>
                        
                    <div className={classes.bottom}>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            className={classes.submitButton}
                            fullWidth
                            onClick={this.handleSubmit}
                        >
                            Register
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            disableElevation
                            className={classes.submitButton}
                            fullWidth
                            onClick={this.toLoginPage}
                        >
                            Sign in instead
                        </Button>
                    </div>               
                </div>
                
            </Fragment>
        );
    }
}

export default connect(
    state => ({user: state.user}),
    {register},
)(withStyles(styles)(Register));

