package com.example.backend.repository;

import com.example.backend.entity.Item;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

  boolean existsByNameAndIsDemoAndGuestId(String name, Boolean isDemo, Long guestId);

  boolean existsByNameAndIsDemoAndGuestIdAndIdNot(String name, Boolean isDemo, Long guestId, Long id);

  List<Item> findAllByIsDemoAndGuestIdOrderBySortOrderAsc(Boolean isDemo, Long guestId);

  Optional<Item> findByIdAndIsDemoAndGuestId(Long id, Boolean isDemo, Long guestId);

  void deleteAllByIsDemoAndGuestId(Boolean isDemo, Long guestId);
}
