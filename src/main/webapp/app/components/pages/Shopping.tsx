import React, { Component } from 'react'
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Card,
    CardActionArea, CardActions,
    CardContent,
    CardMedia, Drawer, FormControl,
    Grid,
    Icon, InputLabel, MenuItem, Select, TextField,
    Typography, withStyles,
    WithStyles
} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import {CommonStore} from "../../stores/CommonStore";
import {ProductStore} from "../../stores/ProductStore";
import {CategoryStore} from "../../stores/CategoryStore";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
    categoryStore: CategoryStore
}

interface IState {
    sidePanelVisibility: boolean
}

const styles = theme =>
    ({
        productCard: {
            maxWidth: 300
        },
        productCardImage: {
            height: 300
        },
        filterButton: {
            position: 'fixed',
            top: 75,
            left: 10,
            zIndex: 999,
            backgroundColor: '#ee6e73'
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    })

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class Shopping extends Component<IProps, IState> {

    constructor(props) {
        super(props)
        this.state = {
            sidePanelVisibility: false
        }
    }

    componentDidMount() {
        // this.props.categoryStore.fetchCategories()
        this.props.productStore.fetchProducts()
    }

    toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        this.setState({sidePanelVisibility: open})
    }

    handleTogglePanelButton = (e) => {
        this.setState({sidePanelVisibility: true})
    }

    render () {
        const {loading} = this.props.commonStore
        const { products } = this.props.productStore
        const { classes } = this.props
        return <div>
            {/* drawer toggle button */}
            <Button
                variant='outlined'
                disabled={loading}
                className={classes.filterButton}
                onClick={this.handleTogglePanelButton}
            >
                Filter
                <Icon>
                    filter
                </Icon>
            </Button>
            {/* drawer */}
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                {/*<form className={classes.form}>

                </form>*/}
            </Drawer>
            <Grid container>
                {products.map(product => {
                    return (
                        <Grid item
                            xs={12}
                              sm={12}
                              md={6}
                              lg={4}
                              xl={3}
                        >
                            <Card className={classes.productCard}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.productCardImage}
                                        image={product.image}
                                        title={product.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {product.title} - <strong>${product.price}</strong>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {product.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    {/*<Button size="small" color="primary">
                                        Share
                                    </Button>*/}
                                    <Button size="small" color="primary" data-product-id={product.id}>
                                        Add to cart
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )

                })}
            </Grid>
        </div>
    }
}

export default withStyles(styles)(Shopping)