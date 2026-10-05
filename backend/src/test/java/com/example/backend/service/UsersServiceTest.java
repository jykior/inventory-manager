package com.example.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UsersServiceTest {

  @Mock
  private UsersRepository usersRepository;
  @Mock
  private AuthenticationManager authenticationManager;
  @Mock
  private PasswordEncoder passwordEncoder;

  private UsersService usersService;

  @BeforeEach
  void setUp() {
    usersService = new UsersService(
        usersRepository,
        authenticationManager,
        passwordEncoder
    );
  }

  @Test
  void 正常にユーザー登録できる() {

    RegisterRequest request = new RegisterRequest();
    request.setEmail("test@example.com");
    request.setPassword("password");
    request.setConfirmPassword("password");
    request.setNickname("凡人");

    when(usersRepository.existsByEmail("test@example.com"))
        .thenReturn(false);

    when(passwordEncoder.encode("password"))
        .thenReturn("hashedPassword");

    Users savedUsers = new Users();

    when(usersRepository.save(any(Users.class)))
        .thenReturn(savedUsers);

    Users result = usersService.register(request);

    assertNotNull(result);

    verify(passwordEncoder).encode("password");
    verify(usersRepository).save(any(Users.class));

    ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);

    verify(usersRepository).save(captor.capture());

    Users savedUser = captor.getValue();

    assertEquals("test@example.com", savedUser.getEmail());
    assertEquals("hashedPassword", savedUser.getPasswordHash());
    assertEquals("凡人", savedUser.getNickname());
  }
}
