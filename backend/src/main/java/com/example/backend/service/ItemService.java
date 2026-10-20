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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * 在庫商品の取得や管理を行うサービスクラス。
 */
@Service
@RequiredArgsConstructor
public class ItemService {

  private final ItemRepository itemRepository;
  private final CategoryRepository categoryRepository;
  private final GuestService guestService;

  public List<ItemResponse> findAll() {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    return itemRepository.
        findAllByIsDemoAndGuestIdOrderBySortOrderAsc(isDemo, guestId)
        .stream()
        .map(ItemResponse::from)
        .toList();
  }

  public ItemResponse createItem(ItemRequest itemRequest) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    if (itemRepository.existsByNameAndIsDemoAndGuestId(itemRequest.getName(), isDemo, guestId)) {
      throw new IllegalArgumentException("ITEM_NAME_ALREADY_EXISTS");
    }

    Category category = categoryRepository.findByIdAndIsDemoAndGuestId(itemRequest.getCategoryId(), isDemo, guestId)
        .orElseThrow(() -> new IllegalArgumentException("CATEGORY_NOT_FOUND"));

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

  public ItemResponse updateItem(Long id, ItemRequest itemRequest) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(() -> new IllegalArgumentException("ITEM_NOT_FOUND"));

    if (itemRepository.existsByNameAndIsDemoAndGuestIdAndIdNot(itemRequest.getName(), isDemo, guestId, id)) {
      throw new IllegalArgumentException("ITEM_NAME_ALREADY_EXISTS");
    }

    item.setName(itemRequest.getName());

    Category category = categoryRepository.
        findByIdAndIsDemoAndGuestId(itemRequest.getCategoryId(), isDemo, guestId)
        .orElseThrow(() -> new IllegalArgumentException("CATEGORY_NOT_FOUND"));

    item.setCategory(category);
    item.setCurrentStock(itemRequest.getCurrentStock());
    item.setAlertEnabled(itemRequest.getAlertEnabled());
    item.setMinStock(itemRequest.getMinStock());
    item.setSortOrder(itemRequest.getSortOrder());

    return ItemResponse.from(itemRepository.save(item));
  }

  public ItemResponse updateStock(Long id, Integer newStock) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(() -> new IllegalArgumentException("ITEM_NOT_FOUND"));

    boolean isStaff = false;

    for (GrantedAuthority authority :
        SecurityContextHolder.getContext().getAuthentication().getAuthorities()) {
      if ("ROLE_STAFF".equals(authority.getAuthority())) {
        isStaff = true;
        break;
      }
    }

    if (isStaff && newStock > item.getCurrentStock()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    item.setCurrentStock(newStock);

    return ItemResponse.from(itemRepository.save(item));
  }

  public void deleteItem(Long id) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(() -> new IllegalArgumentException("ITEM_NOT_FOUND"));

    itemRepository.delete(item);
  }
}
