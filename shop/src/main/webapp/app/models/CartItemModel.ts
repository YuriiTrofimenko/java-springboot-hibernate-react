export default class CartItemModel {
    public productId: number
    public name: string
    public price: number
    public quantity: number
    constructor (productId?, name?, price?, quantity?) {
        this.productId = productId
        this.name = name
        this.price = price
        this.quantity = quantity
    }
}