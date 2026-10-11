package com.example.backend.guest;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 期限切れゲストユーザーアカウントの定期削除をスケジューリングするクラス。
 */
@Component
@RequiredArgsConstructor
public class GuestCleanupScheduler {

  private final GuestService guestService;

  @Scheduled(fixedRate = 10 * 60 * 1000)
  public void cleanupExpiredGuest() {
    guestService.cleanupExpiredGuest();
  }
}
