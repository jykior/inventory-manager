package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
/**
 * ニックネームの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class NicknameUpdateRequest {

  @NotBlank
  private String nickname;
}
