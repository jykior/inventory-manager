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
  const [sortOrder, setSortOrder] = useState("default");

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
    if (sortOrder === "default") {
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
        // sortOrderが同じ場合は商品ID順
        return a.id - b.id;
      });
    }

    if (sortOrder === "desc") {
      filterItems.sort((a, b) => b.currentStock - a.currentStock);
    }
    if (sortOrder === "asc") {
      filterItems.sort((a, b) => a.currentStock - b.currentStock);
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
    sortOrder,
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
    setSortOrder(e.target.value);
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

      <select value={sortOrder} onChange={handleSortChange}>
        <option value="default">カテゴリ順</option>
        <option value="desc">在庫が多い順</option>
        <option value="asc">在庫が少ない順</option>
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
