package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
/**
 * パスワードの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class PasswordUpdateRequest {

  @NotBlank
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#]{6,}$")
  private String password;
}
