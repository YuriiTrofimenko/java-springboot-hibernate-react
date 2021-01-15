import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import Resizer from 'react-image-file-resizer'
import {reaction} from "mobx"
import {
    Button,
    Drawer,
    FormControl,
    Icon, InputLabel,
    MenuItem,
    Select,
    Table,
    TextField,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {CommonStore} from "../../../stores/CommonStore"
import {ProductStore} from "../../../stores/ProductStore"
import {CategoryStore} from "../../../stores/CategoryStore"
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
    categoryStore: CategoryStore
}

interface IState {
    // режимы формы: добавить / редактировать
    formMode: string,
    // флаг: отображать ли сейчас панель
    sidePanelVisibility: boolean
}

const styles = theme =>
    ({
        title: {
            display: 'inline',
            marginRight: 15
        },
        productsTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
        formControl: {
            margin: theme.spacing(1),
            display: 'block'
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        form: {
            margin: 10
        },
        imageTextField: {
            display: 'none'
        },
        errorBlock: {
            right: 0,
            fontSize: '12px',
            color: 'red300',
            position: 'absolute',
            marginTop: '-25px',
        }
    })

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class DashboardProducts extends Component<IProps, IState> {

    constructor(props) {
        super(props)
        this.state = {
            formMode: 'add',
            sidePanelVisibility: false
        }
    }

    titleRef = React.createRef()

    componentDidMount() {
        this.props.categoryStore.fetchCategories()
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
        // разрешенный способ изменения свойств состояния компонента
        // (асинхронная отправка изменений только тех свойств состояния, которые указаны в аргументе)
        this.setState({sidePanelVisibility: open})
    }


    handleProductTitleChange = e => {
        this.props.productStore.setProductTitle(e.target.value)
    }

    handleProductDescriptionChange = e => {
        this.props.productStore.setProductDescription(e.target.value)
    }

    handleProductCategoryChange = e => {
        this.props.productStore.setProductCategory(e.target.value)
        document.getElementById('productCategoryValidator').setAttribute('value', e.target.value)
    }

    handleProductPriceChange = e => {
        this.props.productStore.setProductPrice(e.target.value)
    }

    handleProductQuantityChange = e => {
        this.props.productStore.setProductQuantity(e.target.value)
    }

    handleProductImageChange = e => {
        // из аргументов события получаем ссылку на объект-источник события,
        // и из него - путь к выбранному файлу изображения товара
        const file = e.target.files[0]
        // передаем в функцию обрезки
        this.resizeFile(file).then((image: string) => {
            // когда преоразование будет завершено -
            // установим получившуюся строку base64
            // в модель товара в локльном хранилище
            this.props.productStore.setProductImage(image)
        })
    }

    handleProductAdd = (e) => {
        this.setState({formMode: 'add'})
        this.setState({sidePanelVisibility: true})
    }

    handleProductEdit = (e, productId) => {
        this.props.productStore.setCurrentProductId(productId)
        this.setState({formMode: 'edit'})
        this.setState({sidePanelVisibility: true})
        const currentProduct =
            this.props.productStore.products.find(p => p.id === productId)
        this.props.productStore.setCurrentProduct(currentProduct)
    }

    handleProductDelete = (e, productId) => {
        this.props.productStore.setCurrentProductId(productId)
        this.props.productStore.deleteProduct()
    }

    handleBlur = (e) => {
        console.log(e.target.name + 'Ref')
        console.log(this[e.target.name + 'Ref'].current)
        this[e.target.name + 'Ref'].current.validate(e.target.value)
    }

    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        if (this.state.formMode === 'add') {
            this.props.productStore.add()
        } else {
            this.setState({formMode: 'add'})
            this.props.productStore.update()
        }
    }

    // функция обрезки файла изображения товара до 300х300 пикселей
    // при помощи библиотеки "react-image-file-resizer"
    resizeFile = (file) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
            uri => {
                resolve(uri);
            },
            'base64'
        )
    })

    imageReaction = reaction(
        () => this.props.productStore.currentProductImage, // следим за свойством user
        (image) => {
            // при изменении значения свойства user
            document.getElementById('productImage').setAttribute('src', image)
        }
    )

    render() {
        const {loading} = this.props.commonStore
        const {products} = this.props.productStore
        const {categories} = this.props.categoryStore
        const { classes } = this.props
        return <div>
            <h2 className={classes.title}>Products</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleProductAdd}
            >
                Add
                <Icon>
                    add
                </Icon>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <ValidatorForm
                    className={classes.form}
                    onSubmit={this.handleSubmitForm}
                    onError={errors => console.log(errors)}
                    ref='form'
                >
                    <FormControl
                        className={classes.formControl}
                    >
                        <TextField
                            id='title'
                            name='title'
                            label={'product title'}
                            value={this.props.productStore.currentProduct.title}
                            onChange={this.handleProductTitleChange}
                            required
                            /*validators={['required']}
                            errorMessages={['title is required']}
                            onBlur={this.handleBlur}
                            ref={this.titleRef}*/
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="category-label">category</InputLabel>
                        <Select
                            id="category"
                            labelId='category-label'
                            value={this.props.productStore.currentProduct.categoryId}
                            onChange={this.handleProductCategoryChange}
                        >
                            {categories.map(category => {
                                // console.log(category.id, this.props.productStore.currentProduct.categoryId)
                            return (
                                <MenuItem
                                    value={category.id.toString()}
                                    /*selected={category.id === this.props.productStore.currentProduct.categoryId}*/>
                                    {category.name}
                                </MenuItem>
                            )})}
                        </Select>
                        <input
                            id='productCategoryValidator'
                            tabIndex={-1}
                            autoComplete="off"
                            style={{ opacity: 0, height: 0 }}
                            value={this.props.productStore.currentProduct.categoryId?.toString()}
                            required={true}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id='description'
                            label={'description'}
                            value={this.props.productStore.currentProduct.description}
                            onChange={this.handleProductDescriptionChange}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id="price"
                            label={'price'}
                            value={this.props.productStore.currentProduct.price}
                            onChange={this.handleProductPriceChange}
                            required
                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                            <TextField
                            id="quantity"
                            label={'quantity'}
                            type='number'
                            inputProps={{'min': 0}}
                            value={this.props.productStore.currentProduct.quantity}
                            onChange={this.handleProductQuantityChange}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <div>
                            <div>
                                <img id='productImage'/>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    <div>
                                        image
                                        <TextField
                                            id="image"
                                            type='file'
                                            className={classes.imageTextField}
                                            onChange={this.handleProductImageChange}
                                        />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </FormControl>
                    <hr/>
                    <FormControl className={classes.formControl}>
                        <Button
                            variant='outlined'
                            disabled={loading}
                            type='submit'
                        >
                            Submit
                            <Icon>
                                send
                            </Icon>
                        </Button>
                    </FormControl>
                </ValidatorForm>
            </Drawer>
            <Table>
                <thead>
                <tr>
                    <th data-field='id'>ID</th>
                    <th data-field='title'>Name</th>
                    <th data-field='description'>Description</th>
                    <th data-field='quantity'>Quantity</th>
                    <th data-field='price'>Price</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => {
                    return (
                        <tr>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                <div data-product-id={product.id}>
                                    <Button
                                        onClick={(e) => {
                                            this.handleProductEdit(e, product.id)
                                        }}>
                                        <Icon>edit</Icon>
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            this.handleProductDelete(e, product.id)
                                        }}>
                                        <Icon>delete</Icon>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )

                })}
                </tbody>
            </Table>
        </div>
    }
}

export default withStyles(styles)(DashboardProducts)