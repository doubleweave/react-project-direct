import React, {Component} from 'react';
import EmployerProfile from '../employer-info/Employer_Profile';
import EmployeeProfile from '../employee-info/Employee_Profile';
import Employee from '../../components/employee/Employee';
import Employer from '../../components/employer/Employer';
import Personal from '../personal/Personal';
import Message from '../message/Message';
import Chat from '../../containers/chat/Chat';
import NotFound from '../../components/notFound/NotFound';
import NavFooter from '../../components/navFooter/NavFooter';
import Cookie from 'js-cookie';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import {getRedirectTo} from '../../utils';
import {withStyles} from '@material-ui/core/styles';

import {
    AppBar,
    Toolbar,
    Typography,
} from '@material-ui/core';

import {getUser} from '../../reducers/actions';

const styles = theme => ({
    page: {
        [theme.breakpoints.up('xs')]: {
            width: '100%',
            margin: '0 auto',
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            width: '380px',
            margin: '0 auto',
        },
        height: '100vh',
        backgroundColor: '#dcdcdc',
        flex:1,
    },
    top: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        overflow:'hidden',
    },
    header: {
        position: "sticky ",
        alignItems: 'center',
    },
});


class Main extends Component {

    //add properties for Component object
    state = {
        navList: [ // including all route component data.
            {
                path: '/employer',
                component: Employer,
                title: 'Employee List',
                icon: 'FaceIcon', // same name to file in assets
                text: 'Employee',
            },
            {
                path: '/employee',
                component: Employee,
                title: 'Employer List',
                icon: 'AccountBalanceIcon',
                text: 'Employer',
            },
            {
                path: '/message',
                component: Message,
                title: 'Message List',
                icon: 'SmsOutlinedIcon',
                text: 'Message',
            },
            {
                path: '/personal',
                component: Personal,
                title: 'Personal List',
                icon: 'PermIdentityIcon',
                text: 'Personal',
            },
        ],
    };

    componentDidMount() {
        //Found userId in cookie, but no data in Redux user
        const userId = Cookie.get('userId');
        const {_id} = this.props.user;
        if (userId && !_id) {
            //async action, get user data
            this.props.getUser();
        }
		this.setNavList();
    }


    setNavList = () => {
        let {navList} = this.state;
        const {user} = this.props;
        // hide nav if user.type is employer or employee, add hide to the other one.
        if(user.userType === 'employer') {
            navList = navList.filter(nav => nav.path !== '/employee');
            this.setState({navList});
        } else if(user.userType === 'employee'){
            navList = navList.filter(nav => nav.path !== '/employer');
            this.setState({navList});
        }
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user !== this.props.user) {
					this.setNavList();
        }
        if(prevProps.unReadCount !== this.props.unReadCount) {
            console.log("someone sending me Message.");
        }
    }

    render() {
        const {classes, user} = this.props;
		let {navList} = this.state;

        //1. read userId from cookie
        const userId = Cookie.get('userId');
        //if no userId, redirect to /login
        if (!user || !userId) {
            return <Redirect to='/login'/>;
        }
        //2. if userId exists, read it from redux, check if there is _id
        //if there is no _id in user, return null, use CDM to require data and update redux
        if (!user || !user._id || navList.length < 3) {
            return null;
        } else {
            let path = this.props.location.pathname;
            //3. if there is _id, redirect to required page
            //4. if the url is '/', check the userType and avatar
            if (path === '/') {
                path = getRedirectTo(user.userType, user.avatar);
                return <Redirect to={path}/>;
            }
        }

        console.log('In main.jsx, navList', navList);
        const path = this.props.location.pathname;
        const currentNav = navList.find(nav => nav.path === path);

        return (
            <div className={classes.page}>
                <div className={classes.top}>
                    {currentNav
                        ?
                        <AppBar className={classes.header}>
                            <Toolbar>
                                <Typography variant='h6'>{currentNav.title}</Typography>
                            </Toolbar>
                        </AppBar>
                        :
                        null
                    }
                    <Switch>
                        {
                            navList.map(nav =>
                                <Route
                                    path={nav.path}
                                    component={nav.component}
                                    key={nav.text}
                                />
                            )
                        }

                        <Route path='/employerprofile' component={EmployerProfile}/>
                        <Route path='/employeeprofile' component={EmployeeProfile}/>
                        <Route path='/chat/:userId' component={Chat}/>

                        <Route component={NotFound}/>
                    </Switch>
                </div>
                {currentNav
                    ?
                    <div className={classes.bottom}>  
                        <NavFooter
                            navList={navList}
                            unReadCount={this.props.unReadCount}
                        />
                    </div>
                    :
                    null
                }                
            </div>
            
        );
    }
}

export default connect(
    state => ({
        user: state.user,
        unReadCount: state.chat.unReadCount,
    }),
    {getUser}
)(withStyles(styles)(Main));
