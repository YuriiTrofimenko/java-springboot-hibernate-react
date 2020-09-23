import React, { Component } from 'react'
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Card,
    CardActionArea, CardActions,
    CardContent,
    CardMedia, Checkbox, Drawer, FormControl, FormControlLabel, FormGroup,
    Grid,
    Icon, InputLabel, MenuItem, Select, TextField,
    Typography, withStyles,
    WithStyles
} from "@material-ui/core"
import {inject, observer} from "mobx-react"
import {CommonStore} from "../../stores/CommonStore"
import {ProductStore} from "../../stores/ProductStore"
import {CategoryStore} from "../../stores/CategoryStore"
import {CartStore} from "../../stores/CartStore"
import {UserStore} from '../../stores/UserStore'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
    categoryStore: CategoryStore,
    cartStore: CartStore,
    userStore: UserStore
}

interface IState {
    sidePanelVisibility: boolean,
    snackBarVisibility: boolean,
    snackBarText: string
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
        drawer: {
            width: 300,
            '& .MuiDrawer-paper': {
                position: 'static'
            }
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightBold,
            subHeading: {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },

    })

@inject('commonStore', 'productStore', 'categoryStore', 'cartStore', 'userStore')
@observer
class Shopping extends Component<IProps, IState> {

    constructor(props) {
        super(props)
        this.state = {
            sidePanelVisibility: false,
            snackBarVisibility: false,
            snackBarText: ''
        }
    }

    componentDidMount() {
        // сразу после монтирования компонента в виртуальный DOM
        // просим у локальных хранилищ загрузить
        // списки моделей товаров и категорий
        this.props.categoryStore.fetchCategories()
        this.props.productStore.fetchProducts()
        // TODO когда значения границ в локальном хранилище будут получены с сервера -
        // скопировать их в свойства хранилища - priceFrom и priceTo
        this.props.productStore.fetchProductPriceBounds()
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

    // обработчик события "изменение состояния любого из чекбоксов фильтра категорий"
    handleCategoriesFilter = (e, categoryId) => {
        // в хранилище передаем идентификатор категории, значение чекбокса которой
        // изменилось, и само значение (выбран или не выбран)
        this.props.productStore.setFilerDataCategory(categoryId, e.target.checked)
    }

    handlePriceFromChange = e => {
        this.props.productStore.setFilterDataPriceFrom(e.target.value)
    }

    handlePriceToChange = e => {
        this.props.productStore.setFilterDataPriceTo(e.target.value)
    }

    handleAddToCart = (e, productId) => {
        this.props.cartStore.addToCart(productId, () => {
            this.setState({snackBarText: 'One item added to Your cart'})
            this.setState({snackBarVisibility: true})
            setTimeout(() => {
                this.setState({snackBarVisibility: false})
            }, 6000)
        })
    }

    render () {
        const { loading } = this.props.commonStore
        const { products } = this.props.productStore
        const { categories } = this.props.categoryStore
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
                open={ this.state.sidePanelVisibility }
                onClose={this.toggleDrawer(false)}
                className={classes.drawer}
            >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Icon>list</Icon>
                        <Typography className={classes.heading}>
                            Categories
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup row>
                            {categories.map(category => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name={'c' + category.id}
                                                data-category-id={category.id}
                                                checked={!!this.props.productStore.categories.find(categoryId => categoryId === category.id)}
                                                onClick={(e) => {
                                                    this.handleCategoriesFilter(e, category.id)
                                                }}/>
                                        }
                                        label={category.name} />
                                )})}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Icon>filter</Icon>
                        <Typography className={classes.heading}>
                            Filter
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup row>
                            <div>
                                <Typography className={classes.subHeading}>
                                    Price Range
                                </Typography>
                            </div>
                            <div>
                                <TextField
                                    id="priceFrom"
                                    label={'from'}
                                    value={this.props.productStore.priceFrom}
                                    onChange={this.handlePriceFromChange}
                                />
                                <TextField
                                    id="priceTo"
                                    label={'to'}
                                    value={this.props.productStore.priceTo}
                                    onChange={this.handlePriceToChange}
                                />
                            </div>
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 3</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
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
                                    <Button
                                        size="small"
                                        color="primary"
                                        data-product-id={product.id}
                                        onClick={(e) => {
                                            this.handleAddToCart(e, product.id)
                                        }}
                                        style={{display: this.props.userStore.user ? 'inline' : 'none' }}>
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