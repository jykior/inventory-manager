package com.example.backend.service;

import com.example.backend.dto.request.CategoryRequest;
import com.example.backend.dto.response.CategoryResponse;
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

  public List<CategoryResponse> findAll() {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    return categoryRepository
        .findAllByIsDemoAndGuestId(isDemo, guestId)
        .stream()
        .map(CategoryResponse::from)
        .toList();
  }

  public CategoryResponse createCategory(CategoryRequest categoryRequest) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }
    if (categoryRepository.existsByNameAndIsDemoAndGuestId(categoryRequest.getName(), isDemo, guestId)) {
      throw new IllegalArgumentException("CATEGORY_NAME_ALREADY_EXISTS");
    }
    Category category = new Category();
    category.setName(categoryRequest.getName());
    category.setColorCode(categoryRequest.getColorCode());
    category.setIsDemo(isDemo);
    category.setGuestId(guestId);

    return CategoryResponse.from(categoryRepository.save(category));
  }

  public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
    boolean isDemo = isGuest();
    Long guestId = null;

    if (isDemo) {
      guestId = guestService.getCurrentGuestId();
    }

    Category existingCategory =
        categoryRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
            .orElseThrow(IllegalArgumentException::new);

    if (!existingCategory.getName().equals(categoryRequest.getName())
        && categoryRepository.existsByNameAndIsDemoAndGuestId(
        categoryRequest.getName(),
        isDemo,
        guestId)
    ) {
      throw new IllegalArgumentException("CATEGORY_NAME_ALREADY_EXISTS");
    }

    existingCategory.setName(categoryRequest.getName());
    existingCategory.setColorCode(categoryRequest.getColorCode());

    return CategoryResponse.from(categoryRepository.save(existingCategory));
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
