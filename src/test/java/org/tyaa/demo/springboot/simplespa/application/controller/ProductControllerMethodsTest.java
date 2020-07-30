package org.tyaa.demo.springboot.simplespa.application.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.tyaa.demo.springboot.simplespa.controller.ProductController;
import org.tyaa.demo.springboot.simplespa.model.ProductFilterModel;
import org.tyaa.demo.springboot.simplespa.model.ProductModel;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductControllerMethodsTest {

    private Long lastId = Long.MAX_VALUE;

    @Autowired
    private ProductController productController;

    @Test
    public void shouldFilteredProductsByCategories () {
        final ProductFilterModel filter =
            ProductFilterModel.builder()
                    .categories(Arrays.asList(1L, 2L))
                    .orderBy("id")
                    .sortingDirection(Sort.Direction.DESC)
                    .build();
        ResponseEntity responseEntityFiltered
            = productController.getByCategories(
                filter.categories,
                filter.orderBy,
                filter.sortingDirection
        );
        assertNotNull(responseEntityFiltered);
        assertEquals(responseEntityFiltered.getStatusCode(), HttpStatus.OK);
        ((List<ProductModel>)((ResponseModel)responseEntityFiltered.getBody())
                .getData())
        .forEach(productModel -> {
            if (!(productModel.getCategoryId().equals(1L)
                || productModel.getCategoryId().equals(2L))) {
                fail("Expected Category id equals 1L or 2L, but got " + productModel.getCategoryId());
            }
            if (productModel.getId() > lastId) {
                fail("Expected DESC sort, but got ASC one");
            }
            lastId = productModel.getId();
        });
    }
}
