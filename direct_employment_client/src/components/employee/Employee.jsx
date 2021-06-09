/*
* Employee main page - Router container page
* */
import React, {Component} from 'react';
import UserList from '../../containers/userList/UserList';

export default class Employee extends Component {
    render() {
        return (
            <div>
                <UserList />
            </div>
        );
    }
}

