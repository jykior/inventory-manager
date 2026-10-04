package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 商品（在庫アイテム）を表すエンティティクラス。 カテゴリに紐づき、現在庫数・アラート通知数などの情報を持つ。
 */
@Entity
@Table(name = "items")
@Getter
@Setter

public class Item {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String name;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  private Integer currentStock;

  private Boolean alertEnabled;

  private Integer minStock;

  private Integer sortOrder;

  private Boolean isDemo = false;

  private Long guestId;
}
