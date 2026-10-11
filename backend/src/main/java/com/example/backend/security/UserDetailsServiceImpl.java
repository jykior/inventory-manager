package com.example.backend.security;

import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Securityの認証に使用するユーザー情報を提供するサービスクラス。
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UsersRepository usersRepository;

  @Override
  public UserDetails loadUserByUsername(@NonNull String email) {
    Users users = usersRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return User
        .withUsername(users.getEmail())
        .password(users.getPasswordHash())
        .roles(users.getRole())
        .build();

  }
}
