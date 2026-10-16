package com.example.backend.service;


import com.example.backend.dto.request.ItemRequest;
import com.example.backend.dto.response.ItemResponse;
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

  /**
   * 現在のログインユーザーがゲストか判定する
   */
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

  public List<ItemResponse> findAll() {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    return itemRepository.
        findAllByIsDemoAndGuestIdOrderBySortOrderAsc(isDemo, guestId)
        .stream()
        .map(ItemResponse::from)
        .toList();
  }

  public ItemResponse createItem(ItemRequest itemRequest) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    if (itemRepository.existsByNameAndIsDemoAndGuestId(itemRequest.getName(), isDemo, guestId)) {
      throw new IllegalArgumentException("ITEM_NAME_ALREADY_EXISTS");
    }

    Category category = categoryRepository.findByIdAndIsDemoAndGuestId(itemRequest.getCategoryId(), isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    Item item = new Item();
    item.setName(itemRequest.getName());
    item.setCategory(category);
    item.setCurrentStock(itemRequest.getCurrentStock());
    item.setAlertEnabled(itemRequest.getAlertEnabled());
    item.setMinStock(itemRequest.getMinStock());
    item.setSortOrder(itemRequest.getSortOrder());
    item.setIsDemo(isDemo);
    item.setGuestId(guestId);

    return ItemResponse.from(itemRepository.save(item));
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

  public ItemResponse updateItem(Long id, ItemRequest itemRequest) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setName(itemRequest.getName());

    Category category = categoryRepository.
        findByIdAndIsDemoAndGuestId(itemRequest.getCategoryId(), isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setCategory(category);
    item.setCurrentStock(itemRequest.getCurrentStock());
    item.setAlertEnabled(itemRequest.getAlertEnabled());
    item.setMinStock(itemRequest.getMinStock());
    item.setSortOrder(itemRequest.getSortOrder());

    return ItemResponse.from(itemRepository.save(item));
  }

  public ItemResponse updateStock(Long id, Integer newStock) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setCurrentStock(newStock);

    return ItemResponse.from(itemRepository.save(item));
  }
}
