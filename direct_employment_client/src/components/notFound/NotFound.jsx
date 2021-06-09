/*
* Not_found 404 page - Router UI page
* */
import React, {Component} from 'react';
import {Button} from '@material-ui/core';

export default class Message extends Component {
    render() {
        return (
            <div>
                <h2>No such page.</h2>
                <Button
                    color='primary'
                    onClick={() => this.props.history.replace('/')}
                >
									To Home page
								</Button>
            </div>
        );
    }
}
