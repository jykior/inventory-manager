package com.example.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * ユーザー登録時に使用するリクエストDTO。
 */
@Getter
@Setter
public class RegisterRequest {

  @NotBlank
  @Email
  private String email;
  @NotBlank
  private String password;
  @NotBlank
  private String confirmPassword;
  @NotBlank
  private String nickname;
}