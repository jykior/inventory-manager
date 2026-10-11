package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
/**
 * ログイン時に使用するリクエストDTO。
 */
@Getter
@Setter
public class LoginRequest {
  private String email;
  private String password;
}