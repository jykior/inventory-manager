package com.example.backend.service;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.UserRoleResponse;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * ユーザー情報の取得や認証に関する処理を提供するサービスクラス。
 */
@Service
@RequiredArgsConstructor

public class UsersService {

  private final UsersRepository usersRepository;
  private final AuthenticationManager authenticationManager;
  private final PasswordEncoder passwordEncoder;

  public Authentication login(String email, String password) {

    return authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            email,
            password));
  }

  public Users findByEmail(String email) {
    return usersRepository.findByEmail(email).orElseThrow();
  }

  public void delete(String email) {
    Users users = usersRepository.findByEmail(email).orElseThrow();

    usersRepository.delete(users);
  }

  public Users register(RegisterRequest registerRequest) {
    if (usersRepository.existsByEmail(registerRequest.getEmail())) {
      throw new IllegalArgumentException("EMAIL_ALREADY_EXISTS");
    }
    if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
      throw new IllegalArgumentException();
    }
    Users users = new Users();

    users.setEmail(registerRequest.getEmail());

    users.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

    users.setRole("STAFF");

    users.setNickname(registerRequest.getNickname());

    return usersRepository.save(users);
  }

  public Users updateEmail(String currentEmail, String newEmail) {
    if (usersRepository.existsByEmail(newEmail)) {
      throw new IllegalArgumentException("EMAIL_ALREADY_EXISTS");
    }
    Users users = usersRepository.findByEmail(currentEmail).orElseThrow();

    users.setEmail(newEmail);

    return usersRepository.save(users);
  }

  public void updatePassword(String email, String password) {
    Users users = usersRepository.findByEmail(email).orElseThrow();

    if (passwordEncoder.matches(password, users.getPasswordHash())) {
      throw new IllegalArgumentException("SAME_PASSWORD");
    }

    users.setPasswordHash(passwordEncoder.encode(password));
    usersRepository.save(users);
  }

  public Users updateNickname(String email, String nickname) {
    Users users = usersRepository.findByEmail(email).orElseThrow();

    users.setNickname(nickname);

    return usersRepository.save(users);
  }

  public void updateRole(Long id, String role) {
    if ("ADMIN".equals(role) && usersRepository.existsByRole("ADMIN")) {
      throw new IllegalArgumentException("ADMIN_ALREADY_EXISTS");
    }

    Users users = usersRepository.findById(id).orElseThrow(IllegalArgumentException::new);

    users.setRole(role);

    usersRepository.save(users);
  }

  public List<UserRoleResponse> findAllRoles() {
    return usersRepository.findAll().stream().map(UserRoleResponse::from).toList();
  }
}
