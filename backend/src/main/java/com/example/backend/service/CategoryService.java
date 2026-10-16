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


  public List<CategoryResponse> findAll() {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    return categoryRepository
        .findAllByIsDemoAndGuestId(isDemo, guestId)
        .stream()
        .map(CategoryResponse::from)
        .toList();
  }

  public CategoryResponse createCategory(CategoryRequest categoryRequest) {
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

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
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

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
    Long guestId = guestService.getGuestIdOrNull();
    boolean isDemo = guestId != null;

    Category category =
        categoryRepository.findByIdAndIsDemoAndGuestId(id, isDemo, guestId)
            .orElseThrow(IllegalArgumentException::new);

    categoryRepository.delete(category);
  }
}
