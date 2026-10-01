import { useState } from "react";
import { getStockStatus } from "../../utils/stockStatus";
import { Package, OctagonAlert } from "lucide-react";
import ItemCard from "./ItemCard";
import ItemFilter from "./ItemFilter";
import AddItemModal from "./AddItemModal";
import CategoryModal from "./CategoryModal";
import "./Inventory.css";

function Items({
  allItems,
  categories,
  onUpdateStock,
  onItemsChanged,
  onCategoriesChanged,
  initialStatus,
}) {
  const [displayItems, setDisplayItems] = useState([]);
  const [isSelected, setIsSelected] = useState(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const alertItems = allItems.filter(
    (item) => getStockStatus(item).status === "注意",
  );

  return (
    <>
      {/* 在庫注意簡易表示 */}
      {alertItems.length > 0 && (
        <div className="alert-box">
          <span className="alert-box-icon">
            <OctagonAlert size={20} /> 在庫注意
          </span>
          <span>
            <span>{alertItems.length}件の商品があります</span>
          </span>
        </div>
      )}

      <div className="items-header">
        <h1 className="page-title">
          <Package size={32} />
          商品一覧
        </h1>
        <div className="items-header-actions">
          <button
            className="category-button"
            onClick={async () => {
              await onCategoriesChanged();
              setIsCategoryModalOpen(true);
            }}
          >
            カテゴリ管理
          </button>

          <button
            className="item-add-button"
            onClick={() => setIsAddItemModalOpen(true)}
          >
            ＋ 商品を追加
          </button>
        </div>
      </div>

      <ItemFilter
        allItems={allItems}
        setDisplayItems={setDisplayItems}
        categories={categories}
        initialStatus={initialStatus}
      />

      <table className="item-table">
        <thead>
          <tr>
            <th></th>
            <th>商品名</th>
            <th>カテゴリ</th>
            <th>現在の在庫</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={isSelected === item.id}
              onSelectItem={setIsSelected}
              onUpdateStock={onUpdateStock}
              onItemsChanged={onItemsChanged}
            />
          ))}
        </tbody>
      </table>
      {/* カテゴリ管理モーダル */}
      {isCategoryModalOpen && (
        <CategoryModal
          categories={categories}
          allItems={allItems}
          onClose={() => setIsCategoryModalOpen(false)}
          onCategoriesChanged={onCategoriesChanged}
        />
      )}
      {/* 商品追加モーダル */}
      {isAddItemModalOpen && (
        <AddItemModal
          categories={categories}
          onClose={() => setIsAddItemModalOpen(false)}
          onItemCreated={onItemsChanged}
          onCategoriesChanged={onCategoriesChanged}
        />
      )}
    </>
  );
}
export default Items;
