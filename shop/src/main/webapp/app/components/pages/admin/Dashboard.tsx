import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Icon,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import {CommonStore} from "app/stores/CommonStore";
import {UserStore} from "app/stores/UserStore";

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
}

const styles = theme =>
    ({
        card: {
            display: 'flex',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },
    })

class Dashboard extends Component<IProps, IState> {
    render () {
        const { classes } = this.props
        return <Grid container spacing={3}>
            <Grid item
                sm={12}
                md={4}
                lg={4}
                xl={4}
            >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image="images/category-tree.jpg"
                        title="Categories"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Categories
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <NavLink
                                key={'/admin/categories'}
                                as={NavLink}
                                to={'/admin/categories'}
                            >
                                Go
                            </NavLink>
                        </CardActions>
                    </div>
                </Card>
            </Grid>
            <Grid item
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
            >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image="images/goods.jpg"
                        title="Categories"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Products
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <NavLink
                                key={'/admin/products'}
                                as={NavLink}
                                to={'/admin/products'}
                            >
                                Go
                            </NavLink>
                        </CardActions>
                    </div>
                </Card>
            </Grid>
        </Grid>
    }
}

export default withStyles(styles)(Dashboard)