package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
/**
 * メールアドレスの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class EmailUpdateRequest {

  @NotBlank
  @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
  private String email;
}
