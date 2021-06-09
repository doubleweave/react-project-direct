/*
* Employer main page - Router container component
* */
import React, {Component} from 'react';
import UserList from "../../containers/userList/UserList";

export default class Employer extends Component {
    render() {
        return (
            <div>
                <UserList />
            </div>
        );
    }
}

