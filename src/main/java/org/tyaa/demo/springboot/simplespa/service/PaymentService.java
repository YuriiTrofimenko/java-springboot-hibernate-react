package org.tyaa.demo.springboot.simplespa.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyaa.demo.springboot.simplespa.dao.PaymentHibernateDAO;
import org.tyaa.demo.springboot.simplespa.entity.Payment;
import org.tyaa.demo.springboot.simplespa.model.Cart;
import org.tyaa.demo.springboot.simplespa.model.PaymentModel;
import org.tyaa.demo.springboot.simplespa.model.PaymentResponseModel;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;

import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentHibernateDAO dao;

    public PaymentResponseModel pay(Payment payment) {
        dao.save(payment);
        PaymentResponseModel response =
                PaymentResponseModel.builder()
                .status("success")
                .message("Payment successfull with amount : " + payment.getAmount())
                .build();
        return response;
    }

    public PaymentResponseModel getTx(String vendor) {
        List<Payment> payments = dao.findByVendor(vendor);
        List<PaymentModel> paymentModels = payments.stream().map((p) ->
            PaymentModel.builder()
                .id(p.getId())
                .transactionId(p.getTransactionId())
                .vendor(p.getVendor())
                .paymentDateString((new SimpleDateFormat("dd/mm/yyyy HH:mm:ss a")).format(p.getPaymentDate()))
                .amount(p.getAmount())
                .build()
        ).collect(Collectors.toList());
        return PaymentResponseModel.builder()
            .status("success")
            .payments(paymentModels)
            .build();
    }

    public ResponseModel purchase(Cart cart) throws IOException {
        final Double totalPrice =
                BigDecimal.valueOf(
                        cart.getCartItems().stream()
                                .map(cartItem -> cartItem.getPrice().doubleValue() * cartItem.getQuantity())
                                .reduce(0d, (previousValue, currentValue) -> previousValue + currentValue)
                )
                        .setScale(2, RoundingMode.HALF_UP)
                        .doubleValue();
        final String merchantLogin = "demo";
        final String merchantPassword = "password_1";
        final String url =
                "https://auth.robokassa.ru/Merchant/PaymentForm/FormFLS.js" +
                        "?MerchantLogin="+ merchantLogin +
                        "&Pass1="+ merchantPassword +
                        "&OutSum="+ totalPrice +
                        "&InvId=0" +
                        // "&IncCurrLabel=" +
                        "&Description=ROBOKASSADemo" +
                        "&SignatureValue="+ DigestUtils.md5Hex(merchantLogin + ":" + totalPrice + ":0:"+merchantPassword+":Shp_item=1") +
                        "&Shp_item=1" +
                        "&Culture=en" +
                        "&Encoding=utf-8" +
                        "&IsTest=1";
        System.out.println(url);
        String purchaseButton =
            getUrlBytes(url)
                .replace("document.write(\"", "")
                .replace("\");", "");
        System.out.println(purchaseButton);
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(purchaseButton)
                .build();
    }

    private String getUrlBytes(String urlSpec) throws IOException {
        URL url = new URL(urlSpec);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            InputStream in = connection.getInputStream();
            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK)
            {
                return null;
            }
            int bytesRead = 0;
            byte[] buffer = new byte[1024];
            while ((bytesRead = in.read(buffer)) > 0)
                out.write(buffer, 0, bytesRead);
            out.close();
            return new String(out.toByteArray());
        } finally {
            connection.disconnect();
        }
    }
}
