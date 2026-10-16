package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
/**
 * パスワードの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class PasswordUpdateRequest {

  @NotBlank
  private String password;
}
