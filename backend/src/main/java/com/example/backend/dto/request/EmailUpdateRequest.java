package com.example.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
/**
 * メールアドレスの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class EmailUpdateRequest {

  @NotBlank
  @Email
  private String email;
}
