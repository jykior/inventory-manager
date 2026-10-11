package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
/**
 * アカウント情報の更新に使用するリクエストDTO。
 */
@Getter
@Setter
public class AccountUpdateRequest {

  private String email;
  private String password;
  private String nickname;
}
