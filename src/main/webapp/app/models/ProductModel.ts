export default class ProductModel {
    public id: number
    public title: string
    public description: string
    public quantity: number
    public price: number
    public categoryId: BigInteger
    public image: string
    constructor (id?, title?, description?, quantity?, price?, categoryId?, image?) {
        this.id = id
        this.title = title
        this.description = description
        this.quantity = quantity
        this.price = price
        this.categoryId = categoryId
        this.image = image
    }
}