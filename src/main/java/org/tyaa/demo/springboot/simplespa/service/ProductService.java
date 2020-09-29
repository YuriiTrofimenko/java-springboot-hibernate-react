package org.tyaa.demo.springboot.simplespa.service;

import com.querydsl.core.types.dsl.BooleanExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.tyaa.demo.springboot.simplespa.dao.CategoryHibernateDAO;
import org.tyaa.demo.springboot.simplespa.dao.ProductHibernateDAO;
import org.tyaa.demo.springboot.simplespa.dao.predicate.ProductPredicatesBuilder;
import org.tyaa.demo.springboot.simplespa.entity.Category;
import org.tyaa.demo.springboot.simplespa.entity.Product;
import org.tyaa.demo.springboot.simplespa.model.*;

import javax.transaction.Transactional;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductHibernateDAO productDao;

    @Autowired
    private CategoryHibernateDAO categoryDao;

    public ResponseModel create(ProductModel productModel) {
        Optional<Category> categoryOptional
                = categoryDao.findById(productModel.getCategoryId());
        if(categoryOptional.isPresent()){
            Product product =
                Product.builder()
                    .name(productModel.getTitle())
                    .description(productModel.getDescription())
                    .price(productModel.getPrice())
                    .quantity(productModel.getQuantity())
                    .image(productModel.getImage())
                    .category(categoryOptional.get())
                    .build();
            productDao.save(product);
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Product %s Created", product.getName()))
                    .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Category #%d Not Found", productModel.getCategoryId()))
                .build();
        }
    }

    public ResponseModel update(ProductModel productModel) {
        Optional<Category> categoryOptional
                = categoryDao.findById(productModel.getCategoryId());
        if(categoryOptional.isPresent()){
            Product category =
                Product.builder()
                    .id(productModel.getId())
                    .name(productModel.getTitle())
                    .description(productModel.getDescription())
                    .price(productModel.getPrice())
                    .quantity(productModel.getQuantity())
                    .category(categoryOptional.get())
                    .image(productModel.getImage())
                    .build();
            productDao.save(category);
            // Demo Logging
            System.out.println(String.format("Category %s Updated", category.getName()));
            return ResponseModel.builder()
                    .status(ResponseModel.SUCCESS_STATUS)
                    .message(String.format("Category %s Updated", category.getName()))
                    .build();
        } else {
            return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(String.format("Category #%d Not Found", productModel.getCategoryId()))
                    .build();
        }
    }

    public ResponseModel getAll() {
        List<Product> products = productDao.findAll(Sort.by("id").descending());
        List<ProductModel> productModels =
            products.stream()
                .map(p ->
                    ProductModel.builder()
                        .id(p.getId())
                        .title(p.getName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .quantity(p.getQuantity())
                        .image(p.getImage())
                        .category(
                            CategoryModel.builder()
                                .id(p.getCategory().getId())
                                .name(p.getCategory().getName())
                                .build()
                        )
                        .build()
                )
                .collect(Collectors.toList());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(productModels)
                .build();
    }

    public ResponseModel delete(Long id) {
        Optional<Product> productOptional = productDao.findById(id);
        if (productOptional.isPresent()){
            Product product = productOptional.get();
            productDao.delete(product);
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Product #%s Deleted", product.getName()))
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Product #%d Not Found", id))
                .build();
        }
    }

    public ResponseModel getFiltered(ProductFilterModel filter) {
        List<Product> products =
            productDao.findByCategoryIds(
                filter.categories,
                Sort.by(filter.sortingDirection, filter.orderBy)
            );
        return getResponseModelFromEntities(products);
    }

    // поиск отфильтрованного и отсортированного списка товаров
    // на основе запросов query dsl
    public ResponseModel search(ProductSearchModel searchModel) {
        List<Product> products = null;
        if (searchModel.searchString != null && !searchModel.searchString.isEmpty()) {
            ProductPredicatesBuilder builder = new ProductPredicatesBuilder();
            // разбиение значения http-параметра search
            // на отдельные выражения условий фильтрации
            Pattern pattern = Pattern.compile("([\\w]+?)(:|<|>|<:|>:)([\\w\\]\\[\\,]+?);");
            Matcher matcher = pattern.matcher(searchModel.searchString + ";");
            while (matcher.find()) {
                builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
            }
            BooleanExpression expression = builder.build();
            // выполнение sql-запроса к БД
            // с набором условий фильтрации
            // и с указанием имени поля и направления сортировки
            products =
                (List<Product>) productDao.findAll(
                    expression,
                    Sort.by(
                        searchModel.sortingDirection,
                        searchModel.orderBy
                    )
                );
        } else {
            products =
                productDao.findAll(
                    Sort.by(
                        searchModel.sortingDirection,
                        searchModel.orderBy
                    )
                );
        }
        return getResponseModelFromEntities(products);
    }

    private ResponseModel getResponseModelFromEntities(List<Product> products) {
        List<ProductModel> productModels =
            products.stream()
                .map((p)->
                    ProductModel.builder()
                        .id(p.getId())
                        .title(p.getName())
                        .description(p.getDescription())
                        .price(p.getPrice())
                        .quantity(p.getQuantity())
                        .image(p.getImage())
                        .category(
                            CategoryModel.builder()
                                .id(p.getCategory().getId())
                                .name(p.getCategory().getName())
                                .build()
                        )
                        .build()
                )
                .collect(Collectors.toList());
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .data(productModels)
            .build();
    }

    /* public ResponseModel getProductsPriceBounds() {
        Map<String, Integer> maxndMin = new LinkedHashMap<>();
        maxndMin.put("min", productDao.findAll().stream()
                .min((p1, p2) -> p1.getPrice().subtract(p2.getPrice())
                        .toBigInteger().intValue())
                .map(product -> (int)Math.round(product.getPrice().doubleValue())).get());
        maxndMin.put("max", productDao.findAll().stream()
                .max((p1, p2) -> p1.getPrice().subtract(p2.getPrice())
                        .toBigInteger().intValue())
                .map(product -> (int)Math.round(product.getPrice().doubleValue())).get());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(maxndMin)
                .build();
    } */

    public ResponseModel getProductsPriceBounds() {
        Map<String, Integer> maxAndMin = new LinkedHashMap<>();
        maxAndMin.put("min", productDao.findMinimum().intValue());
        maxAndMin.put("max", productDao.findTop1ByOrderByPriceDesc().getPrice().intValue());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(maxAndMin)
                .build();
    }

    public ResponseModel getProductsQuantityBounds() {
        Map<String, Integer> maxAndMin = new LinkedHashMap<>();
        maxAndMin.put("min", productDao.findTop1ByOrderByQuantityAsc().getQuantity());
        maxAndMin.put("max", productDao.findTop1ByOrderByQuantityDesc().getQuantity());
        return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(maxAndMin)
                .build();
    }
}
