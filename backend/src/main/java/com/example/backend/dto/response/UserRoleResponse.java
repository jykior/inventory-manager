package com.example.backend.dto.response;

import com.example.backend.entity.Users;

/**
 * ユーザーの権限一覧用レスポンスDTO。
 */
public record UserRoleResponse(Long id, String nickname, String role) {

  public static UserRoleResponse from(Users users) {
    return new UserRoleResponse(users.getId(), users.getNickname(), users.getRole());
  }
}
