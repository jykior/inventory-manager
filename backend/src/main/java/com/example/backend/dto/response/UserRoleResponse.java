package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserRoleResponse {
  private Long id;
  private String nickname;
  private String role;

  public UserRoleResponse(Long id,  String nickname, String role) {
    this.id = id;
    this.nickname = nickname;
    this.role = role;
  }
}
