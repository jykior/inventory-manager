package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

/**
 * ログイン時に使用するリクエストDTO。
 */
@Getter
@Setter
public class LoginRequest {

  @NotBlank
  private String email;

  @NotBlank
  private String password;
}