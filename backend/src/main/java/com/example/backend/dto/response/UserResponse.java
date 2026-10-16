package com.example.backend.dto.response;

import com.example.backend.entity.Users;

/**
 * ユーザー情報を返すレスポンスDTO。
 */
public record UserResponse(Long id, String email, String nickname, String role) {

  public static UserResponse from(Users users) {
    return new UserResponse(users.getId(), users.getEmail(), users.getNickname(), users.getRole());
  }
}

