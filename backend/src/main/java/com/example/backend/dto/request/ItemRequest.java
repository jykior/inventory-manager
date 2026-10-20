package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 商品の登録・更新に使用するリクエストDTO。
 */
@Getter
@Setter

public class ItemRequest {

  @NotBlank
  private String name;

  @NotNull
  private Long categoryId;

  @NotNull
  @Min(0)
  private Integer currentStock;

  @NotNull
  private Boolean alertEnabled;

  @Min(0)
  private Integer minStock;

  private Integer sortOrder;
}
