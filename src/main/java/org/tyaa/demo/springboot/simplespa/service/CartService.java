package org.tyaa.demo.springboot.simplespa.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyaa.demo.springboot.simplespa.dao.ProductHibernateDAO;
import org.tyaa.demo.springboot.simplespa.entity.Product;
import org.tyaa.demo.springboot.simplespa.model.Cart;
import org.tyaa.demo.springboot.simplespa.model.CartItem;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private ProductHibernateDAO productDAO;

    public ResponseModel getCartItems(Cart cart) {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message("Cart data fetched successfully")
            .data(cart.getCartItems())
            .build();
    }

    // изменить число определенного товара в объекте корзины
    public ResponseModel changeCartItemCount(Cart cart, Long productId, CartItem.Action action) {
        CartItem currentCartItem = null;
        // в БД находим описание товара по его ИД
        Product product = productDAO.findById(productId).get();
        // в объекте корзины пытаемся найти элемент списка товаров в корзине,
        // у которого ИД описания товара такой же, как заданный для изменения
        Optional<CartItem> currentCartItemOptional =
                cart.getCartItems()
                        .stream()
                        .filter((item) -> item.getProductId().equals(productId))
                        .findFirst();
        System.out.println(productId);
        System.out.println(currentCartItemOptional);
        System.out.println(currentCartItemOptional.isPresent());
        // если в корзине уже был хотя бы один такой товар
        if (currentCartItemOptional.isPresent()) {
            currentCartItem = currentCartItemOptional.get();
            System.out.println(currentCartItem);
        } else {
            // если нет - добавляем товар в корзину с указанием его количества равным 0
            currentCartItem =
                    CartItem.builder()
                    .productId(productId)
                    .name(product.getName())
                    .price(product.getPrice())
                    .quantity(0)
                    .build();
            cart.getCartItems().add(currentCartItem);
        }
        if (action != null) {
            switch (action) {
                case ADD:
                    // увеличение числа товара в корзтине на 1
                    System.out.println(currentCartItem.getQuantity());
                    currentCartItem.setQuantity(currentCartItem.getQuantity() + 1);
                    System.out.println(currentCartItem.getQuantity());
                    break;
                case SUB:
                    // уменьшение числа товара в корзтине на 1,
                    // но если осталось 0 или меньше - полное удаление товара из корзины
                    currentCartItem.setQuantity(currentCartItem.getQuantity() - 1);
                    if (currentCartItem.getQuantity() <= 0) {
                        cart.getCartItems().remove(currentCartItem);
                    }
                    break;
                case REM:
                    // безусловное полное удаление товара из корзины
                    cart.getCartItems().remove(currentCartItem);
                    break;
                default:
                    break;
            }
        }
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message("Cart data changed successfully")
            .data(cart.getCartItems())
            .build();
    }
}
