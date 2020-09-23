import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import {Provider} from "mobx-react"
// экземпляр CommonStore экспортируется из модуля
// по умолчанию
// поэтому здесь импортируется без фигурных скобок
// и может быть проименован как угодно
// (в данном случае назван commonStore)
import commonStore from "./stores/CommonStore"
import userStore from "./stores/UserStore"
import routerStore from "./stores/RouterStore"
import categoryStore from "./stores/CategoryStore"
import productStore from "./stores/ProductStore"
import cartStore from "./stores/CartStore"

const stores = {
    commonStore,
    userStore,
    routerStore,
    categoryStore,
    productStore,
    cartStore
}

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider >,
    document.getElementById('root')
)