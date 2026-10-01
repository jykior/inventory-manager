import { useState } from "react";
import { createItem } from "../../api/itemApi";
import AddCategoryModal from "./AddCategoryModal";

function AddItemModal({ categories ,onClose, onItemCreated,onCategoriesChanged }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [error, setError] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
/**
 * 商品を登録する。
 *
 * 入力内容をチェックし、
 * 商品を作成した後に商品一覧を更新する。
 */
  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("※商品名を入力してください※");
      return;
    }
    if (!category) {
      setError("※カテゴリを選択してください※");
      return;
    }
    try {
      const item = {
        name: name.trim(),
        category: { id: Number(category) },
        current_stock: currentStock,
        minStock,
        alertEnabled,
        sortOrder: sortOrder,
      };

      await createItem(item);
      await onItemCreated();
      onClose();
    } catch (error) {
      if (error.message === "ITEM_FAILED") {
        setError("※権限がありません※");
      } else setError("※同じ商品名がすでに登録されています※");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="item-modal">
        <div className="item-modal-header">
          <h2>商品を追加</h2>

          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <label>
          商品名<span className="required"> *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div className="category-add">
          <label>
            カテゴリ<span className="required"> *</span>
          </label>
          <button type="button" onClick={() => setIsAddCategoryModalOpen(true)}>
            ＋追加
          </button>
        </div>
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">選択してください</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label>
          現在の在庫数<span className="required"> *</span>
          <input
            type="number"
            min="0"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
          />
        </label>

        <label className="alert-setting">
          <input
            type="checkbox"
            checked={alertEnabled}
            onChange={(e) => setAlertEnabled(e.target.checked)}
          />
          アラートを設定する
        </label>

        <label>
          アラート数 (下回ったら通知)
          <input
            type="number"
            min="0"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
          />
        </label>

        <label>
          並び順
          <input
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
          <p>※ 数字が小さいほど上に表示されます</p>
        </label>

        <button className="save-button" onClick={handleSubmit}>
          保存する
        </button>
      </div>

      {/*カテゴリ追加モーダル*/}
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryModalOpen(false)}
          onCategoryCreated={onCategoriesChanged}
        />
      )}
    </div>
  );
}

export default AddItemModal;
