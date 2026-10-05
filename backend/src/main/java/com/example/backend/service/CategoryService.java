package com.example.backend.service;

import com.example.backend.entity.Category;
import com.example.backend.guest.GuestService;
import com.example.backend.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * カテゴリの取得や管理を行うサービスクラス。
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

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

  public List<Category> findAll() {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    return categoryRepository.findAllByIsDemoAndGuestId(isDemo, guestId);
  }

  public Category createCategory(Category category) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    if (categoryRepository.existsByNameAndIsDemoAndGuestId(category.getName(), isDemo, guestId)) {
      throw new IllegalArgumentException("CATEGORY_NAME_ALREADY_EXISTS");
    }
    category.setIsDemo(isDemo);
    category.setGuestId(guestId);

    return categoryRepository.save(category);
  }

  public Category updateCategory(Long id, Category category) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }

    Category existingCategory =
        categoryRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
            .orElseThrow(IllegalArgumentException::new);

    if (!existingCategory.getName().equals(category.getName())
        && categoryRepository.existsByNameAndIsDemoAndGuestId(
        category.getName(),
        isDemo,
        guestId)
    ) {
      throw new IllegalArgumentException("CATEGORY_NAME_ALREADY_EXISTS");
    }

    existingCategory.setName(category.getName());
    existingCategory.setColorCode(category.getColorCode());

    return categoryRepository.save(existingCategory);
  }

  public void deleteCategory(Long id) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    Category category =
        categoryRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
            .orElseThrow(IllegalArgumentException::new);

    categoryRepository.delete(category);
  }
}
