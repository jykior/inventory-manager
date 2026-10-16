package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

/**
 * ユーザーの権限変更に使用するリクエストDTO。
 */
@Getter
@Setter

public class RoleRequest {

  @NotBlank
  @Pattern(regexp = "ADMIN|MANAGER|STAFF")
  private String role;
}
