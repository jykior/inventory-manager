package com.example.backend.dto.response;

import com.example.backend.entity.Item;
/**
 * 商品情報を返すレスポンスDTO。カテゴリ情報も含む。
 */
public record ItemResponse(
    Long id,
    String name,
    CategoryResponse category,
    Integer currentStock,
    Boolean alertEnabled,
    Integer minStock,
    Integer sortOrder) {

  public static ItemResponse from(Item item) {
    return new ItemResponse(
        item.getId(),
        item.getName(),
        CategoryResponse.from(item.getCategory()),
        item.getCurrentStock(),
        item.getAlertEnabled(),
        item.getMinStock(),
        item.getSortOrder()
    );
  }
}
