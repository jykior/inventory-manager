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
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    itemRepository.delete(item);
  }

  public ItemResponse updateItem(Long id, ItemRequest itemRequest) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

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
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Item item = itemRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
        .orElseThrow(IllegalArgumentException::new);

    item.setCurrentStock(newStock);

    return ItemResponse.from(itemRepository.save(item));
  }
}
