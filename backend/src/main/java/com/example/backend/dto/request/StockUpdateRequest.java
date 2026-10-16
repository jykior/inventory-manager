package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
/**
 * 在庫数の更新に使用するリクエストDTO。
 */
@Getter
@Setter
public class StockUpdateRequest {

  @NotNull
  @Min(0)
  private Integer currentStock;
}
