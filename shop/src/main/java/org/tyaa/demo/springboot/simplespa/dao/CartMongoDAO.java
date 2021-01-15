package org.tyaa.demo.springboot.simplespa.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.tyaa.demo.springboot.simplespa.model.Cart;

public interface CartMongoDAO extends MongoRepository<Cart, String> {
    Cart findCartByUserId(Long userId);
}
