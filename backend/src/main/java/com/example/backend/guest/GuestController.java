package com.example.backend.guest;

import com.example.backend.dto.response.UserResponse;
import com.example.backend.entity.Users;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * ゲストログイン・ログアウトに関するAPIを提供するコントローラークラス。
 */
@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestController {

  private final GuestService guestService;
  private final SecurityContextRepository securityContextRepository;

  @PostMapping("/login")
  public UserResponse guestLogin(
      HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse) {

    try {
      Users guest = guestService.guestLogin();
      guestService.createDemoData(guest.getId());

      Authentication authentication = new UsernamePasswordAuthenticationToken(
          guest.getEmail(),
          null,
          List.of(new SimpleGrantedAuthority("ROLE_GUEST"))
      );

      SecurityContext context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(authentication);
      SecurityContextHolder.setContext(context);

      securityContextRepository.saveContext(
          context,
          httpServletRequest,
          httpServletResponse
      );

      return  UserResponse.from(guest);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.CONFLICT);
    }
  }

  @PostMapping("/logout")
  public void logout(Authentication authentication, HttpServletRequest request) {
    if (authentication != null) {
      for (GrantedAuthority authority : authentication.getAuthorities()) {
        if ("ROLE_GUEST".equals(authority.getAuthority())) {
          guestService.deleteDemoData();
          break;
        }
      }
    }
    SecurityContextHolder.clearContext();

    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }
  }
}
