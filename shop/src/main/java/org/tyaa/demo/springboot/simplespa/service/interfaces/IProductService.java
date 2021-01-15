package org.tyaa.demo.springboot.simplespa.service.interfaces;

import org.tyaa.demo.springboot.simplespa.model.ProductFilterModel;
import org.tyaa.demo.springboot.simplespa.model.ProductModel;
import org.tyaa.demo.springboot.simplespa.model.ProductSearchModel;
import org.tyaa.demo.springboot.simplespa.model.ResponseModel;

public interface IProductService {
    ResponseModel create(ProductModel productModel);
    ResponseModel update(ProductModel productModel);
    ResponseModel getAll();
    ResponseModel delete(Long id);
    ResponseModel getFiltered(ProductFilterModel filter);
    ResponseModel search(ProductSearchModel searchModel);
}
