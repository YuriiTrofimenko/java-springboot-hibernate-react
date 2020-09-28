package org.tyaa.demo.springboot.simplespa.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyaa.demo.springboot.simplespa.dao.PaymentHibernateDAO;
import org.tyaa.demo.springboot.simplespa.model.Cart;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private APIContext apiContext;

    @Autowired
    private PaymentHibernateDAO dao;

    public Payment createPayment(
            Cart cart,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency);

        final Double totalPrice =
            BigDecimal.valueOf(
                cart.getCartItems().stream()
                    .map(cartItem -> cartItem.getPrice().doubleValue() * cartItem.getQuantity())
                    .reduce(0d, (previousValue, currentValue) -> previousValue + currentValue)
            ).setScale(2, RoundingMode.HALF_UP).doubleValue();
        amount.setTotal(String.format("%.2f", totalPrice));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public ResponseModel executePayment(String paymentId, String payerId) throws PayPalRESTException{
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);
        payment = payment.execute(apiContext, paymentExecute);
        if (payment.getState().equals("approved")) {
            return ResponseModel.builder()
                    .status("success")
                    .message("Payment successful with id: " + payment.getId())
                    .build();
        } else {
            return ResponseModel.builder()
                    .status("success")
                    .message("Payment fail with message: " + payment.getFailureReason())
                .build();
        }
    }
}
