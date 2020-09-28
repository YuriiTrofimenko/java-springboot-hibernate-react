package org.tyaa.demo.springboot.simplespa.controller;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.tyaa.demo.springboot.simplespa.model.Cart;
import org.tyaa.demo.springboot.simplespa.model.CartItem;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;
import org.tyaa.demo.springboot.simplespa.service.CartService;
import org.tyaa.demo.springboot.simplespa.service.PaymentService;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService productService;

    @Autowired
    private PaymentService paymentService;

    // внедрение объекта сеанса http через аргумент метода
    @GetMapping("")
    @ResponseBody
    public ResponseEntity<ResponseModel> getCartItems(HttpSession httpSession) {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        return new ResponseEntity<>(productService.getCartItems(cart), HttpStatus.OK);
    }

    @PostMapping("/{id}")
    @ResponseBody
    public ResponseEntity<ResponseModel> addCartItemCount(@PathVariable("id") Long id, HttpSession httpSession) {
        // попытка извлечь из объекта сеанса объект корзины
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            // если не удалось - создаем новый объект корзины
            cart = new Cart();
        }
        // вызов метода службы - увеличить число товара в корзине на 1
        ResponseModel response =
            productService.changeCartItemCount(
                cart
                , id
                , CartItem.Action.ADD
            );
        // сохранение объекта корзины в сеанс -
        // первичное или обновление
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<ResponseModel> subtractCartItemCount(@PathVariable("id") Long id, HttpSession httpSession) throws InstantiationException, IllegalAccessException {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        ResponseModel response =
            productService.changeCartItemCount(
                cart
                , id
                , CartItem.Action.SUB
            );
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<ResponseModel> deleteCartItem(@PathVariable("id") Long id, HttpSession httpSession) {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        ResponseModel response =
            productService.changeCartItemCount(
                cart
                , id
                , CartItem.Action.REM
            );
        httpSession.setAttribute("CART", cart);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // этот метод нужно вызвать с фронтенда синхронно
    @GetMapping("/pay")
    public String payment(HttpSession httpSession, HttpServletResponse response) throws PayPalRESTException, IOException {
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        Payment payment =
            paymentService.createPayment(
                cart,
                "USD",
                "paypal",
                "sale",
                "testing",
                "http://localhost:8090/simplespa/api/cart/pay/cancel",
            "http://localhost:8090/simplespa/api/cart/pay/success"
            );
        for(Links link : payment.getLinks()) {
            // после того, как пользователь сделал выбор на странице агрегатора,
            // в объект payment агрегатор помещает ответ -
            // одну из двух гиперссылок, заданных ему выше
            if(link.getRel().equals("approval_url")) {
                // response.sendRedirect(link.getHref());
                // в зависимости от того, отменил или подтвердил пользователь оплату,
                // выполняем перенаправление на один из двух ресурсов
                return "redirect:" + link.getHref();
            }
        }
        return "redirect:/";
    }

    // вызывается перенаправлением из действия payment
    // после того, как получена одна из гиперссылок в ответ на отмену или
    // подтвреждение оплаты,
    // при этом параметры предоставляются агрегатором
    @GetMapping("/pay/success")
    public String successPay(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            HttpSession httpSession
    ) throws PayPalRESTException {
        // завершение платежа
        paymentService.executePayment(paymentId, payerId);
        Cart cart = (Cart) httpSession.getAttribute("CART");
        if (cart == null) {
            cart = new Cart();
        }
        cart.getCartItems().clear();
        // возврат перенаправления вместо имени представления -
        // на страницу, сообщающую об успешном завершении оплаты
        return "redirect:/payment:success";
    }

    @GetMapping("/pay/cancel")
    public String cancelPay() {
        return "redirect:/payment:cancel";
    }
}
