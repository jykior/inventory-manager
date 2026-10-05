package com.example.backend.service;


import com.example.backend.entity.Category;
import com.example.backend.entity.Item;
import com.example.backend.guest.GuestService;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * 在庫商品の取得や管理を行うサービスクラス。
 */
@Service
@RequiredArgsConstructor
public class ItemService {

  private final ItemRepository itemRepository;
  private final CategoryRepository categoryRepository;
  private final GuestService guestService;

  // 現在のログインユーザーがゲストか判定する
  private boolean isGuest() {
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

  public List<Item> findAll() {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    return itemRepository.findAllByIsDemoAndGuestIdOrderBySortOrderAsc(isDemo, guestId);
  }

  public Item createItem(Item item) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    if (itemRepository.existsByNameAndIsDemoAndGuestId(item.getName(), isDemo, guestId)) {
      throw new IllegalArgumentException("ITEM_NAME_ALREADY_EXISTS");
    }

    Category category = categoryRepository.findByIdAndIsDemoAndGuestId(item.getCategory().getId(), isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setIsDemo(isDemo);
    item.setGuestId(guestId);
    item.setCategory(category);

    return itemRepository.save(item);
  }

  public void deleteItem(Long id) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    itemRepository.delete(item);
  }

  public Item updateItem(Long id, Item updateItem) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setName(updateItem.getName());

    Category category = categoryRepository.
        findByIdAndIsDemoAndGuestId(updateItem.getCategory().getId(), isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setCategory(category);
    item.setCurrentStock(updateItem.getCurrentStock());
    item.setAlertEnabled(updateItem.getAlertEnabled());
    item.setMinStock(updateItem.getMinStock());
    item.setSortOrder(updateItem.getSortOrder());
    item.setGuestId(guestId);

    return itemRepository.save(item);
  }

  public Item updateStock(Long id, Integer newStock) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setCurrentStock(newStock);

    return itemRepository.save(item);
  }
}
