package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
/**
 * ユーザーの権限変更に使用するリクエストDTO。
 */
@Getter
@Setter

public class RoleRequest {

  private String role;
}
