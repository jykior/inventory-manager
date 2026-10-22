import { useEffect, useState } from "react";
import { getStockStatus } from "../../utils/stockStatus";
/**
 * 商品一覧のカテゴリ・状態・在庫数による絞り込み、
 * 商品名検索、並び替えを行う。
 */
function ItemFilter({ allItems, setDisplayItems, categories, initialStatus }) {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
    let filterItems = [...allItems];

    // カテゴリ絞り込み
    if (selectedCategory !== "すべて") {
      filterItems = filterItems.filter(
        (item) => item.category?.name === selectedCategory,
      );
    }

    // 状態絞り込み
    if (selectedStatus !== "すべて") {
      filterItems = filterItems.filter((item) => {
        const stockStatus = getStockStatus(item);

        return stockStatus.status === selectedStatus;
      });
    }

    // 並び替え
    if (sortType === "default") {
      filterItems.sort((a, b) => {
        const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

        if (orderA !== orderB) {
          return orderA - orderB;
        }
        // 番号が同じ場合は商品ID順
        return a.id - b.id;
      });
    }
    if (sortType === "order") {
      filterItems.sort((a, b) => {
        //  カテゴリID順
        const categoryIdA = a.category?.id ?? Number.MAX_SAFE_INTEGER;
        const categoryIdB = b.category?.id ?? Number.MAX_SAFE_INTEGER;

        if (categoryIdA !== categoryIdB) {
          return categoryIdA - categoryIdB;
        }
        // 同じカテゴリ内では商品sortOrder順
        const itemSortOrderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const itemSortOrderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

        if (itemSortOrderA !== itemSortOrderB) {
          return itemSortOrderA - itemSortOrderB;
        }
        // 番号が同じ場合は商品ID順
        return a.id - b.id;
      });
    }
    if (sortType === "desc") {
      filterItems.sort((a, b) => b.currentStock - a.currentStock);
    }
    if (sortType === "asc") {
      filterItems.sort((a, b) => a.currentStock - b.currentStock);
    }
    if (sortType === "name") {
      filterItems.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    if (sortType === "nameDesc") {
      filterItems.sort((a, b) => b.name.localeCompare(a.name, "ja"));
    }
    // 商品名検索
    if (searchKeyword.trim() !== "") {
      filterItems = filterItems.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }
    setDisplayItems(filterItems);
  }, [
    allItems,
    selectedCategory,
    selectedStatus,
    sortType,
    searchKeyword,
    setDisplayItems,
  ]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div className="filter-area">
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="すべて">すべてのカテゴリー</option>

        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <select value={selectedStatus} onChange={handleStatusChange}>
        <option value="すべて">すべての状態</option>
        <option value="正常">正常</option>
        <option value="少ない">少ない</option>
        <option value="注意">注意</option>
      </select>

      <select value={sortType} onChange={handleSortChange}>
        <option value="default">並び順（全カテゴリ）</option>
        <option value="order">並び順（カテゴリ別）</option>
        <option value="desc">在庫が多い順</option>
        <option value="asc">在庫が少ない順</option>
        <option value="name">名前順（昇順）</option>
        <option value="nameDesc">名前順（降順）</option>
      </select>

      <div className="search-box">
        <span>⌕</span>

        <input
          type="text"
          placeholder="商品名で検索"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default ItemFilter;
