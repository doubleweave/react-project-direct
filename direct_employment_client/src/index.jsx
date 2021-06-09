import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

import store from './reducers/store'
import Register from './containers/register/Register';
import Login from './containers/login/Login';
import Main from './containers/main/Main';

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 420,
            md: 600,
            lg: 1280,
            xl: 1920,
        },
    },
})

ReactDOM.render((
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <HashRouter>
                <Switch>
                    <Route path='/Register' component={Register}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route component={Main}></Route>
                </Switch>
            </HashRouter>
        </Provider>
    </MuiThemeProvider>
),document.getElementById("root"));
