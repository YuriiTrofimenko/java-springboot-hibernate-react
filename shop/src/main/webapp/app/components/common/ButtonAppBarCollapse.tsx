import React, {Component} from "react"
import { withStyles } from "@material-ui/core/styles"
import {Menu, WithStyles} from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from '@material-ui/icons/Menu'

interface IProps extends WithStyles<typeof styles> {
    children: any
}

interface IState {
    anchorEl: any
}

const styles = theme => ({
    buttonCollapse: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
        margin: "10px",
        boxShadow: "none"
    }
})

class ButtonAppBarCollapse extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
        this.handleMenu = this.handleMenu.bind(this);
    }
    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    render() {
        const { classes } = this.props
        const { anchorEl } = this.state
        const open = Boolean(anchorEl)

        return (
            <div className={classes.buttonCollapse}>
                <IconButton onClick={this.handleMenu} edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    {this.props.children}
                </Menu>
            </div>
        )
    }
}
export default withStyles(styles)(ButtonAppBarCollapse)