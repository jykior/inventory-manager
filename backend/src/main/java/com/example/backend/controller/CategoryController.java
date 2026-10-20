package com.example.backend.controller;

import com.example.backend.dto.request.CategoryRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 商品カテゴリに関するAPIを提供するコントローラークラス。
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  @GetMapping
  public List<CategoryResponse> getCategories() {
    return categoryService.findAll();
  }

  @PostMapping
  public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
    try {
      return categoryService.createCategory(categoryRequest);
    } catch (IllegalArgumentException e) {
      if ("CATEGORY_NAME_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw e;
    }
  }

  @PutMapping("/{id}")
  public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest categoryRequest) {
    try {
      return categoryService.updateCategory(id, categoryRequest);
    } catch (IllegalArgumentException e) {
      if ("CATEGORY_NOT_FOUND".equals(e.getMessage())){
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
      }
      if ("CATEGORY_NAME_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw e;
    }
  }

  @DeleteMapping("/{id}")
  public void deleteCategory(@PathVariable Long id) {
    try {
      categoryService.deleteCategory(id);
    } catch (DataIntegrityViolationException e) {
      throw new ResponseStatusException(HttpStatus.CONFLICT);
    } catch (IllegalArgumentException e) {
      if ("CATEGORY_NOT_FOUND".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }
}
