import React from 'react';
import logo from './logo.png';
import {
    withStyles,
    withWidth,
} from '@material-ui/core';

const styles = theme => ({
    container: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    img: {
        width: '30%',
    },
});

function Logo({classes,width}) {
    return (
        <div className={classes.container}>
            <img src={logo} alt="logo" className={classes.img}/>
        </div>
    );
}

export default withWidth()(withStyles(styles)(Logo));
