/*
UI Component for user to select avatar
 */

import React, {Component} from 'react';
import {
    List,
    ListSubheader,
    Typography,
    Card,
    ListItem,
    Paper,
    Avatar,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    gridIcon: {
        width: '100%',
        background: 'green',
        display: 'block',
    },
    gridText: {
        width: '100%',
        background: 'red',
    },
    root: {
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
    },
    item: {
        width: '25%',
        touchAction:'pan-y',
    },
    paper: {
        width: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        textAlign: 'center',
        background: '#ddd',
    },
    card: {
        display: 'flex',
        flexWrap: 'wrap ',
    },
    headerAvatar: {
        width: '20%',
    }
};

class Header_selector extends Component {

    static propTypes = {
        setAvatar: PropTypes.func.isRequired,
    };

    state = {
        gridData: [
            {icon: '1', text: '1'},
            {icon: '2', text: '2'},
            {icon: '3', text: '3'},
            {icon: '4', text: '4'},
            {icon: '5', text: '5'},
            {icon: '6', text: '6'},
            {icon: '7', text: '7'},
            {icon: '8', text: '8'},
        ],
        avatar: '',
    };

    handleClick = (icon) => () => {
        icon = icon ? icon : '';
        const avatar = !icon ? '': `/static/images/avatar/${icon}.jpg`;
        this.props.setAvatar(icon);
        this.setState({avatar});
    };

    render() {
        const {classes} = this.props;
        const {gridData, avatar} = this.state;

        return (
            <div>
                <List subheader={<ListSubheader>
                    {
                        avatar === ''
                            ?
                            'Choose an avatar:'
                            :
                            (
                                <div>
                                    <Typography>Selected avatar:</Typography>
                                    <img
                                        alt='avatarImg'
                                        src={avatar}
                                        className={classes.headerAvatar}
                                    />
                                </div>
                            )
                    }
                </ListSubheader>}
                      className={classes.root}
                >
                    <Card className={classes.card}>
                    {
                        gridData.map(({icon, text}) => (
                            <ListItem
                                button
                                key={text}
                                className={classes.item}
                                id={icon}
                                onClick={this.handleClick(icon)}
                            >
                                <Paper className={classes.paper}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={`/static/images/avatar/${icon}.jpg`}
                                    />
                                </Paper>
                            </ListItem>
                        ))
                    }
                    </Card>
                </List>
            </div>
        );
    };
}

export default withStyles(styles)(Header_selector);
