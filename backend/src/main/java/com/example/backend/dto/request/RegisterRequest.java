package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
/**
 * ユーザー登録時に使用するリクエストDTO。
 */
@Getter
@Setter
public class RegisterRequest {
  private String email;
  private String password;
  private String confirmPassword;
  private String nickname;
}