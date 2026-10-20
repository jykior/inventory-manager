package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

/**
 * ユーザー登録時に使用するリクエストDTO。
 */
@Getter
@Setter
public class RegisterRequest {

  @NotBlank
  @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
  private String email;

  @NotBlank
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#]{6,}$")
  private String password;

  @NotBlank
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#]{6,}$")
  private String confirmPassword;

  @NotBlank
  private String nickname;
}