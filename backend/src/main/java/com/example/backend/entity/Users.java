package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 *ユーザー情報を管理するエンティティクラス。メールアドレス、パスワード、権限、ニックネームなどのユーザー情報を保持する。
 */
@Entity
@Table(name = "users")
@Getter
@Setter

public class Users {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String email;

  private String passwordHash;

  private String role;

  private String nickname;
}
