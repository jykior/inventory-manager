package com.example.backend.controller;

import com.example.backend.entity.Category;
import com.example.backend.service.CategoryService;
import java.util.List;
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
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public List<Category> getCategories() {
    return categoryService.findAll();
  }

  @PostMapping
  public Category createCategory(@RequestBody Category category) {
    try {
      return categoryService.createCategory(category);
    } catch (IllegalArgumentException e) {
      if ("CATEGORY_NAME_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PutMapping("/{id}")
  public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
    try {
      return categoryService.updateCategory(id, category);
    } catch (IllegalArgumentException e) {
      if ("CATEGORY_NAME_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping("/{id}")
  public void deleteCategory(@PathVariable Long id) {
    try {
      categoryService.deleteCategory(id);
    } catch (DataIntegrityViolationException e) {

      throw new ResponseStatusException(HttpStatus.CONFLICT);
    } catch (IllegalArgumentException e) {

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }
}
