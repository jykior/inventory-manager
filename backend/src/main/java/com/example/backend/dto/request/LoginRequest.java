package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
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