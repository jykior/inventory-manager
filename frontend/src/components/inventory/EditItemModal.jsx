import { useState } from "react";
import { updateItem } from "../../api/itemApi";

function EditItemModal({ item, categories, onClose, onItemChanged }) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(String(item.category.id));
  const [currentStock, setCurrentStock] = useState(item.currentStock);
  const [minStock, setMinStock] = useState(item.minStock);
  const [alertEnabled, setAlertEnabled] = useState(item.alertEnabled);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState(item.sortOrder);
/**
 * 商品情報を更新する。
 *
 * 入力内容をチェックし、
 * 商品を更新した後に商品一覧を更新する。
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
      const updateItemData = {
        id: item.id,
        name: name.trim(),
        category: { id: Number(category) },
        currentStock: currentStock,
        minStock,
        alertEnabled,
        sortOrder,
      };

      await updateItem(updateItemData);
      await onItemChanged();
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
          <h2>商品を編集</h2>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
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
        <label>
          カテゴリ<span className="required"> *</span>
        </label>
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
    </div>
  );
}

export default EditItemModal;
