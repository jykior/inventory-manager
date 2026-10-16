package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
/**
 * カテゴリの登録・更新に使用するリクエストDTO。
 */
@Getter
@Setter

public class CategoryRequest {
  @NotBlank
  private String name;
  @NotBlank
  private String colorCode;
}
