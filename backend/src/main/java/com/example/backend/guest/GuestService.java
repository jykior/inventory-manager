package com.example.backend.guest;

import com.example.backend.entity.Category;
import com.example.backend.entity.Item;
import com.example.backend.entity.Users;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.UsersRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * ゲストユーザーの作成・判定やデモデータの管理を行うサービスクラス。
 */
@Service
@RequiredArgsConstructor
public class GuestService {

  private final CategoryRepository categoryRepository;
  private final ItemRepository itemRepository;
  private final UsersRepository usersRepository;

  public Users guestLogin() {
    Users guest = new Users();

    guest.setEmail("guest" + UUID.randomUUID() + "@example.com");
    guest.setRole("GUEST");
    guest.setLastAccessedAt(LocalDateTime.now());

    guest = usersRepository.save(guest);

    guest.setNickname("ゲスト" + guest.getId());
    guest = usersRepository.save(guest);

    return guest;
  }

  public void createDemoData(Long guestId) {
    Map<Long, Category> categoryMap = createDemoCategories(guestId);

    createDemoItems(categoryMap, guestId);
  }

  private Map<Long, Category> createDemoCategories(Long guestId) {
    List<Category> realCategories = categoryRepository.findAllByIsDemoAndGuestId(false, null);

    List<Category> demoCategories = new ArrayList<>();
    Map<Long, Category> categoryMap = new HashMap<>();

    for (Category realCategory : realCategories) {
      Category demoCategory = new Category();

      demoCategory.setName(realCategory.getName());
      demoCategory.setColorCode(realCategory.getColorCode());
      demoCategory.setIsDemo(true);
      demoCategory.setGuestId(guestId);

      demoCategories.add(demoCategory);
      categoryMap.put(realCategory.getId(), demoCategory);
    }
    categoryRepository.saveAll(demoCategories);
    return categoryMap;
  }

  private void createDemoItems(Map<Long, Category> categoryMap, Long guestId) {
    List<Item> realItems = itemRepository.findAllByIsDemoAndGuestIdOrderBySortOrderAsc(false, null);

    List<Item> demoItems = new ArrayList<>();

    for (Item realItem : realItems) {
      Item demoItem = new Item();

      demoItem.setName(realItem.getName());
      demoItem.setCurrentStock(realItem.getCurrentStock());
      demoItem.setAlertEnabled(realItem.getAlertEnabled());
      demoItem.setMinStock(realItem.getMinStock());
      demoItem.setSortOrder(realItem.getSortOrder());
      demoItem.setIsDemo(true);
      demoItem.setGuestId(guestId);

      Category demoCategory = categoryMap.get(realItem.getCategory().getId());

      demoItem.setCategory(demoCategory);

      demoItems.add(demoItem);
    }

    itemRepository.saveAll(demoItems);
  }

  @Transactional
  public Users createGuestWithDemoData() {
    Users guest = guestLogin();
    createDemoData(guest.getId());
    return guest;
  }

  public Long getCurrentGuestId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    return usersRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)).getId();
  }
  /**
   * 現在のログインユーザーがゲストか判定する
   */
  public boolean isGuest() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null) {
      return false;
    }
    for (GrantedAuthority authority : authentication.getAuthorities()) {
      if ("ROLE_GUEST".equals(authority.getAuthority())) {
        return true;
      }
    }
    return false;
  }
  /**
   * ゲストならゲストID、それ以外はnullを返す。
   */
  public Long getGuestIdOrNull() {
    return isGuest() ? getCurrentGuestId() : null;
  }
  /**
   * ゲストの最終アクセス日時を更新する。
   *
   * @return ゲストが存在して更新できた場合はtrue、存在しない場合はfalse
   */
  public boolean updateLastAccessedAt() {
    Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Users guest = usersRepository.findByEmail(email).orElse(null);

    if (guest == null) {
      return false;
    }
    guest.setLastAccessedAt(LocalDateTime.now());

    usersRepository.save(guest);

    return true;
  }

  @Transactional
  public void deleteCurrentGuestData() {
    Long guestId = getCurrentGuestId();

    deleteDemoData(guestId);
  }

  @Transactional
  public void cleanupExpiredGuest() {
    LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);

    List<Users> expiredGuest =
        usersRepository.findByRoleAndLastAccessedAtBefore("GUEST", threshold);

    for (Users guest : expiredGuest) {
      deleteDemoData(guest.getId());
    }
  }

  @Transactional
  public void deleteDemoData(Long guestId) {
    itemRepository.deleteAllByIsDemoAndGuestId(true, guestId);
    categoryRepository.deleteAllByIsDemoAndGuestId(true, guestId);
    usersRepository.deleteById(guestId);
  }

}
