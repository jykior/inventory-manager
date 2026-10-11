package com.example.backend.guest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
/**
 * ゲストユーザーの最終アクセス日時を更新し、期限切れで削除されたゲストのセッションを破棄するフィルタークラス。
 */
@Component
@RequiredArgsConstructor
public class GuestAccessFilter extends OncePerRequestFilter {

  private final GuestService guestService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null
        && authentication.isAuthenticated()
        && authentication.getAuthorities().stream().anyMatch(authority ->
        "ROLE_GUEST".equals(authority.getAuthority()))) {

      if (!guestService.updateLastAccessedAt()) {
        SecurityContextHolder.clearContext();

        clearSession(request);
      }
      }
    filterChain.doFilter(request, response);
  }

  private void clearSession(@NonNull HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate();
    }
  }
}
