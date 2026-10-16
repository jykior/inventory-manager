package com.example.backend.controller;

import com.example.backend.dto.request.EmailUpdateRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.NicknameUpdateRequest;
import com.example.backend.dto.request.PasswordUpdateRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.dto.response.UserRoleResponse;
import com.example.backend.entity.Users;
import com.example.backend.service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * ユーザー認証に関するAPIを提供するコントローラークラス。
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class UsersController {

  private final UsersService usersService;
  private final SecurityContextRepository securityContextRepository;

  @PostMapping("/login")
  public UserResponse login(
      @Valid @RequestBody LoginRequest loginRequest,
      HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse) {

    try {
      Authentication authentication = usersService.login(
          loginRequest.getEmail(),
          loginRequest.getPassword()
      );

      httpServletRequest.getSession(true);
      httpServletRequest.changeSessionId();

      SecurityContext context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(authentication);
      SecurityContextHolder.setContext(context);

      securityContextRepository.saveContext(
          context,
          httpServletRequest,
          httpServletResponse
      );
      Users users = usersService.findByEmail(authentication.getName());

      return UserResponse.from(users);

    } catch (AuthenticationException e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
  }

  @PostMapping("/logout")
  public void logout(HttpServletRequest request) {
    SecurityContextHolder.clearContext();

    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }
  }

  @PostMapping("/register")
  public UserResponse register(@Valid @RequestBody RegisterRequest registerRequest) {
    try {
      Users users = usersService.register(registerRequest);

      return UserResponse.from(users);

    } catch (IllegalArgumentException e) {
      if ("EMAIL_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PatchMapping("/email")
  public UserResponse updateEmail(
      @Valid @RequestBody EmailUpdateRequest emailUpdateRequest,
      Authentication authentication,
      HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse) {

    try {
      Users users = usersService.updateEmail(authentication.getName(), emailUpdateRequest.getEmail());

      Authentication newAuthentication = new UsernamePasswordAuthenticationToken(
          users.getEmail(),
          null,
          authentication.getAuthorities()
      );

      SecurityContext context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(newAuthentication);
      SecurityContextHolder.setContext(context);

      securityContextRepository.saveContext(
          context,
          httpServletRequest,
          httpServletResponse
      );
      return UserResponse.from(users);

    } catch (IllegalArgumentException e) {
      if ("EMAIL_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PatchMapping("/password")
  public void updatePassword(
      @Valid @RequestBody PasswordUpdateRequest passwordUpdateRequest,
      Authentication authentication) {
    try {
      usersService.updatePassword(authentication.getName(), passwordUpdateRequest.getPassword());
    } catch (IllegalArgumentException e) {
      if ("SAME_PASSWORD".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PatchMapping("/nickname")
  public UserResponse updateNickname(
      @Valid @RequestBody NicknameUpdateRequest nicknameUpdateRequest,
      Authentication authentication) {

    Users users = usersService.updateNickname(
        authentication.getName(),
        nicknameUpdateRequest.getNickname()
    );

    return UserResponse.from(users);
  }

  @PatchMapping("/{id}/role")
  public void updateRole(@PathVariable Long id, @Valid @RequestBody RoleRequest roleRequest) {
    try {
      usersService.updateRole(id, roleRequest.getRole());
    } catch (IllegalArgumentException e) {
      if ("ADMIN_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping
  public void delete(Authentication authentication) {
    usersService.delete(authentication.getName());
  }

  @GetMapping("/users")
  public List<UserRoleResponse> findAll() {
    return usersService.findAllRoles();
  }
}
