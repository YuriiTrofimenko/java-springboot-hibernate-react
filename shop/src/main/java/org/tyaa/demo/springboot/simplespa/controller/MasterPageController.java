package org.tyaa.demo.springboot.simplespa.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MasterPageController {

    @RequestMapping(value = {
            "/",
            "/shopping",
            "/signin",
            "/signup",
            "/admin",
    })
    public String index() {
        return "index.html";
    }

    @RequestMapping(value = {"/payment:success"})
    public String paymentSuccess() {
        return "payment_success.html";
    }

    @RequestMapping(value = {"/payment:cancel"})
    public String paymentCancel() {
        return "payment_cancel.html";
    }
}
