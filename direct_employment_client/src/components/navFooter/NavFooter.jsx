import React, {Component, Fragment} from 'react'

import {
    BottomNavigation,
    BottomNavigationAction,
    Badge,
} from '@material-ui/core';

import {withStyles} from '@material-ui/core/styles';

import FaceIcon from '@material-ui/icons/Face';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

import {withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';


const styles = theme => ({
    stickToBottom: {
        [theme.breakpoints.up('xs')]: {
            width: '100%',
            margin: '0 auto',
        },
        [theme.breakpoints.between('sm', 'lg')]: {
            width: '380px',
            margin: '0 auto',
        },
        position: 'fixed',
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)',
        backgroundColor: '#f5f5f5',
        
    },
    bottomBadge: {
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


class Nav_Footer extends Component {
    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired,
    };

    state = {
        value: '',
				unReadCount: -1,
    };

    componentDidMount() {
        const value = this.props.location.pathname;
        this.setState({value});
    }

    handleChange = (event, value) => {
        this.setState({value});
        this.props.history.replace(value);
    };

    renderSwitch = (param) => {
        switch (param) {
            case 'FaceIcon':
                return <FaceIcon/>;
            case 'AccountBalanceIcon':
                return <AccountBalanceIcon/>;
            case 'SmsOutlinedIcon':
                return <SmsOutlinedIcon/>;
            case 'PermIdentityIcon':
                return <PermIdentityIcon/>;
            default:
                return null;
        }
    };


    render() {
        const {value} = this.state;
        const {classes, unReadCount} = this.props;
        let {navList} = this.props;


        // Check hide props to hide page
        navList = navList.filter(nav => !nav.hide);


        return (
            <Fragment>
                <BottomNavigation
                    value={value}
                    onChange={this.handleChange}
                    showLabels
                    className={classes.stickToBottom}
                >
                    {
                        navList.map((nav) => {
                            return (
                                <BottomNavigationAction
                                    key={nav.text}
                                    value={nav.path}
                                    label={
                                        <Badge
                                            badgeContent={nav.path === '/message' ? unReadCount : 0}
                                            color="secondary"
                                            className={classes.bottomBadge}
                                        >
                                            {this.renderSwitch(nav.icon)}
                                            {nav.text}
                                        </Badge>}
                                />
                            )
                        })
                    }

                </BottomNavigation>
            </Fragment>
        );
    };
}


export default withRouter(withStyles(styles)(Nav_Footer));
