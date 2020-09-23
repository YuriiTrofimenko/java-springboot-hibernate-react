import {action, computed, observable} from 'mobx'
import Product from '../models/ProductModel'
import commonStore from './CommonStore'
import Category from "app/models/CategoryModel";
import CartItemModel from "app/models/CartItemModel";

class CartStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201

    @observable cartItems: Array<CartItemModel> = []
    @observable cartShown: boolean = false

    @computed get cartItemsCount () {
        return this.cartItems
            .map(cartItem => cartItem.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    }

    @computed get cartItemsTotalPrice () {
        return this.cartItems
            .map(cartItem => cartItem.price * cartItem.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
            .toFixed(2)
    }

    @action setCartVisibility (open: boolean) {
        this.cartShown = open
    }

    @action fetchCartItems () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('/simplespa/api/cart', {
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.cartItems =
                        JSON.parse(
                            decodeURIComponent(
                                JSON.stringify(responseModel.data)
                                    .replace(/(%2E)/ig, '%20')
                            )
                        )
                } else if (responseModel.status === 'fail') {
                    commonStore.setError(responseModel.message)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action addToCart(productId: number, notifySuccess: () => void) {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('/simplespa/api/cart/' + productId,{
            method: 'POST'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.fetchCartItems()
                    notifySuccess()
                } else if (responseModel.status === 'fail') {
                    commonStore.setError(responseModel.message)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }
}
export {CartStore}
export default new CartStore()