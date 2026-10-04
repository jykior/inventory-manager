package com.example.backend.guest;

import com.example.backend.entity.Category;
import com.example.backend.entity.Item;
import com.example.backend.entity.Users;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.UsersRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GuestService {

  private final CategoryRepository categoryRepository;
  private final ItemRepository itemRepository;
  public final UsersRepository usersRepository;

  public Users guestLogin() {
    Users guest = new Users();

    guest.setEmail("guest"+ UUID.randomUUID()+"@example.com");
    guest.setRole("GUEST");

    guest = usersRepository.save(guest);

    guest.setNickName("ゲスト"+guest.getId());

    return guest;
  }

  public Long getCurrentGuestId(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    Users guest =usersRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("GUEST_NOT_FOUND"));

    return guest.getId();
  }

  public void createDemoData(Long guestId) {
    List<Category> realCategories = categoryRepository.findAllByIsDemoAndGuestId(false,null);

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
    copyItems(categoryMap,guestId);
  }

  public List<Item> copyItems(Map<Long, Category> categoryMap,Long guestId) {
    List<Item> realItems = itemRepository.findAllByIsDemoAndGuestIdOrderBySortOrderAsc(false,null);

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

    return itemRepository.saveAll(demoItems);
  }

  @Transactional
  public void deleteDemoData() {
    Long guestId = getCurrentGuestId();

    itemRepository.deleteAllByIsDemoAndGuestId(true,guestId);
    categoryRepository.deleteAllByIsDemoAndGuestId(true,guestId);
    usersRepository.deleteById(guestId);
  }

}
