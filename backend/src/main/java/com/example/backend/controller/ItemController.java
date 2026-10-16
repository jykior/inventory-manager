package com.example.backend.controller;

import com.example.backend.dto.request.ItemRequest;
import com.example.backend.dto.request.StockUpdateRequest;
import com.example.backend.dto.response.ItemResponse;
import com.example.backend.service.ItemService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 商品情報に関するAPIを提供するコントローラークラス。
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

  private final ItemService itemService;

  @GetMapping
  public List<ItemResponse> getItem() {
    return itemService.findAll();
  }

  @PostMapping
  public ItemResponse createItem(@Valid @RequestBody ItemRequest itemRequest) {
    try {
      return itemService.createItem(itemRequest);
    } catch (IllegalArgumentException e) {
      if ("ITEM_NAME_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping("/{id}")
  public void deleteItem(@PathVariable Long id) {
    try {
      itemService.deleteItem(id);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PutMapping("/{id}")
  public ItemResponse updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest itemRequest) {
    try {
      return itemService.updateItem(id, itemRequest);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }

  @PatchMapping("/{id}/stock")
  public ItemResponse updateStock(@PathVariable Long id, @Valid @RequestBody StockUpdateRequest stockUpdateRequest) {
    try {
      return itemService.updateStock(id, stockUpdateRequest.getCurrentStock());
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }
}
