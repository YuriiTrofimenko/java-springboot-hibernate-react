import {action, computed, observable} from 'mobx'
import Product from '../models/ProductModel'
import commonStore from './CommonStore'
import Category from "app/models/CategoryModel"
import CartItemModel from "app/models/CartItemModel"
import {Md5} from 'ts-md5/dist/md5'

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

    @action getPurchaseButton(givePurchaseButtonHtml: (htmlText: string) => void) {
        commonStore.clearError()
        commonStore.setLoading(true)
        /* const merchantLogin: string = 'demo'
        const merchantPassword: string = 'password_1'
        const url = `https://auth.robokassa.ru/Merchant/PaymentForm/FormFLS.js
                        ?MerchantLogin=${merchantLogin}
                        &Pass1=${merchantPassword}
                        &OutSum=${this.cartItemsTotalPrice}
                        &InvId=0
                        &IncCurrLabel=""
                        &Description=ROBOKASSA Demo
                        &SignatureValue=${Md5.hashStr(`${merchantLogin}:${this.cartItemsTotalPrice}:0:${merchantPassword}:Shp_item=1`)}
                        &Shp_item=1
                        &Culture=en
                        &Encoding=utf-8
                        &IsTest=1` */
        /* url.replace(/\s/g,'') */
        fetch("/simplespa/api/cart/purchase",{
            method: 'GET'/* ,
            mode: 'no-cors' */
        }).then((response) => {
            /* const text = response.text()
            console.log(text)
            text.then(text2 => console.log(text2)) */
            return response.json()
        }).then(response => {
            if (response) {
                givePurchaseButtonHtml(response.data)
                // givePurchaseButtonHtml(responseBody.replace('document.write("', '').replace('");', ''))
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