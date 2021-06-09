import React, {Component, Fragment} from 'react'
import {
	Paper, 
	TextField,
	IconButton, 
	Badge, 
	Button, 
} from "@material-ui/core";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
    bottom_message: {
        [theme.breakpoints.up('xs')]: {
            width: '100%',
            margin: '0 auto',
        },
        [theme.breakpoints.between('sm', 'lg')]: {
            width: '378px',
            margin: '0 auto',
        },
        display: 'flex',
        position: 'fixed',
        bottom: '0',
        alignItems: 'center',
    },
    bottom_message_input: {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
});

class ChatBottomInput extends Component {

    handleChange = name => event => {
        this.props.onChange(name, event.target.value);
    };

    handleSubmit = () => {
        this.props.onSubmit();
    };

    handleShowEmoji = () => {
        this.props.onShowEmoji();
    };

    handleClick = () => {
        this.props.onHideEmoji();
    };

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <Paper
                    elevation={0}
                    className={classes.bottom_message}
                >
                    <TextField
                        size='small'
                        id="input-send-message"
                        label="TextField"
                        variant="outlined"
                        className={classes.bottom_message_input}
                        value={this.props.content}
                        onChange={this.handleChange('content')}
                        onClick={this.handleClick}
                    />
                    <IconButton
                        aria-label="show 4 new mails"
                        color="inherit"
                        onClick={this.handleShowEmoji}
                    >
                        <Badge>
                            <InsertEmoticonIcon/>
                        </Badge>
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.bottom_message_button}
                        onClick={this.handleSubmit}
                    >
                        Send
                    </Button>
                </Paper>
            </Fragment>
        );
    };
}

export default  withStyles(styles)(ChatBottomInput);
