package com.example.backend.dto.response;

import com.example.backend.entity.Category;
/**
 * カテゴリ情報を返すレスポンスDTO。
 */
public record CategoryResponse(
    Long id,
    String name,
    String colorCode
) {
  public static CategoryResponse from(Category category){
    return new CategoryResponse(category.getId(), category.getName(), category.getColorCode());
  }
}