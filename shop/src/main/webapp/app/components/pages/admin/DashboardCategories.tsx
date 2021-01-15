import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {inject, observer} from "mobx-react"
import Category from '../../../models/CategoryModel'
import {reaction} from 'mobx'
import {CategoryStore} from "app/stores/CategoryStore";
import {CommonStore} from "app/stores/CommonStore";
import {Button, Drawer, Icon, Table, TextField, withStyles, WithStyles} from "@material-ui/core";

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
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
        categoriesTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
    })

@inject("commonStore", "categoryStore")
@observer
class DashboardCategories extends Component<IProps, IState> {

    constructor(props) {
        super(props)
        this.state = {
            formMode: 'add',
            sidePanelVisibility: false
        }
    }

    componentDidMount() {
        /* document.getElementById('categoryFormSideNav')
            .style
            .transform = 'translateX(0%)' */
        this.props.categoryStore.fetchCategories()
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

    handleCategoryNameChange = e => {
        // e.preventDefault()
        // e.stopPropagation()
        this.props.categoryStore.setCategoryName(e.target.value)
    }

    handleCategoryAdd = (e) => {
        this.setState({formMode: 'add'})
        this.setState({sidePanelVisibility: true})
    }

    handleCategoryEdit = (e, categoryId) => {
        this.setState({formMode: 'edit'})
        this.setState({sidePanelVisibility: true})
        const currentCategory =
            this.props.categoryStore.categories.find(c => c.id === categoryId)
        this.props.categoryStore.setCurrentCategory(currentCategory)
    }

    handleCategoryDelete = (e, categoryId) => {
        this.props.categoryStore.setCurrentCategoryId(categoryId)
        this.props.categoryStore.deleteCategory()
    }

    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        if (this.state.formMode === 'add') {
            this.props.categoryStore.add()
        } else {
            this.setState({formMode: 'add'})
            this.props.categoryStore.update()
        }
    }

    render () {
        const { loading } = this.props.commonStore
        const { categories } = this.props.categoryStore
        const { classes } = this.props
        return <div>
            <h2 className={classes.title}>Categories</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleCategoryAdd}
            >
                Add
                <Icon>
                    add
                </Icon>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <form>
                    <div>
                        <TextField
                            id="name"
                            label={'category name'}
                            value={this.props.categoryStore.currentCategory.name}
                            onChange={this.handleCategoryNameChange}
                        />
                    </div>
                    <div>
                        <Button
                            disabled={loading}
                            onClick={this.handleSubmitForm}
                        >
                            Submit
                            <Icon>
                                send
                            </Icon>
                        </Button>
                    </div>
                </form>
            </Drawer>
            <Table>
                <thead>
                <tr className={classes.categoriesTableColumnsHeader}>
                    <th data-field="id">ID</th>
                    <th data-field="name">Name</th>
                </tr>
                </thead>
                <tbody>
                    {categories.map(category => {
                        return (
                            <tr>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <div data-category-id={category.id}>
                                        <Button
                                            onClick={(e) => {
                                                this.handleCategoryEdit(e, category.id)
                                            }}>
                                            <Icon>edit</Icon>
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                this.handleCategoryDelete(e, category.id)
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

export default withStyles(styles)(DashboardCategories)