import {action, observable} from "mobx"
import Category from '../models/CategoryModel'
import commonStore from './CommonStore'
import User from "app/models/UserModel";
import Product from "app/models/ProductModel";

class CategoryStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201

    @observable currentCategory: Category = new Category()
    @observable currentCategoryId: BigInteger = null
    @observable categories: Array<Category> = []

    @action setCategoryName(name: string) {
        this.currentCategory.name = name
    }

    @action setCurrentCategory(category: Category) {
        this.currentCategory = category
    }

    @action setCurrentCategoryId(id: BigInteger) {
        this.currentCategoryId = id
    }

    @action fetchCategories() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('/simplespa/api/categories',{
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // полученный объект модели может содержать
                    // свойства, значения которых закодированы из UTF-8 в ASCII,
                    // поэтому производим полное раскодирование:
                    // ts-object конвертируем в json-string (stringify),
                    // декодируем (decodeURIComponent)
                    // json-string конвертируем в  ts-object (parse)
                    this.categories =
                        JSON.parse(
                            decodeURIComponent(
                                JSON.stringify(responseModel.data)
                                    .replace(/(%2E)/ig, "%20")
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
    
    @action add () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('/simplespa/api/category',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(this.currentCategory.name)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_CREATED) {
                    this.fetchCategories()
                    this.setCurrentCategory(new Category())
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action update () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`/simplespa/api/category/${this.currentCategory.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(this.currentCategory.name)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_OK) {
                    this.fetchCategories()
                    this.setCategoryName('')
                    this.setCurrentCategory(new Category())
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action deleteCategory() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch('/simplespa/api/category/' + this.currentCategoryId,{
            method: 'DELETE'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.fetchCategories()
                    this.setCurrentCategoryId(null)
                    this.setCurrentCategory(new Category())
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
export {CategoryStore}
export default new CategoryStore()