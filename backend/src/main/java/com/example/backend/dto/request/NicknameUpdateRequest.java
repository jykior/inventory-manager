package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;import lombok.Getter;
import lombok.Setter;
/**
 * ニックネームの変更に使用するリクエストDTO。
 */
@Getter
@Setter
public class NicknameUpdateRequest {

  @NotBlank
  @Size(max = 20)
  private String nickname;
}
