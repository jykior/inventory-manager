import { useState } from "react";
import { updateItem } from "../../api/itemApi";

function EditItemModal({
  item,
  categories,
  onClose,
  onItemChanged,
  onMessage,
}) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(String(item.category.id));
  const [currentStock, setCurrentStock] = useState(item.currentStock);
  const [alertEnabled, setAlertEnabled] = useState(item.alertEnabled);
  const [minStock, setMinStock] = useState(item.minStock ?? "");
  const [sortOrder, setSortOrder] = useState(item.sortOrder ?? "");
  const [error, setError] = useState("");

  const errorMessage = (text) => {
    setError(text);
    setTimeout(() => setError(""), 5000);
  };
  /**
   * 商品情報を更新する。
   *
   * 入力内容をチェックし、
   * 商品を更新した後に商品一覧を更新する。
   */
  const handleSubmit = async () => {
    if (!name.trim()) {
      errorMessage("※商品名を入力してください※");
      return;
    }
    if (!category) {
      errorMessage("※カテゴリを選択してください※");
      return;
    }
    if (currentStock === "") {
      errorMessage("※現在の在庫数を入力してください※");
      return;
    }
    if (alertEnabled && minStock === "") {
      errorMessage("※アラート数を入力してください※");
      return;
    }
    try {
      const updateItemData = {
        id: item.id,
        name: name.trim(),
        categoryId: Number(category),
        currentStock: Number(currentStock),
        minStock: minStock === "" ? null : Number(minStock),
        alertEnabled,
        sortOrder: sortOrder === "" ? null : Number(sortOrder),
      };

      await updateItem(updateItemData);
      await onItemChanged();
      onClose();
      onMessage("◎商品を変更しました", "success");
    } catch (error) {
      if (error.message === "ITEM_NAME_ALREADY_EXISTS") {
        errorMessage("※同じ商品名がすでに登録されています※");
      } else if (error.message === "ITEM_OR_CATEGORY_NOT_FOUND") {
        errorMessage("※商品またはカテゴリが見つかりません※");
      } else if (error.message === "ITEM_REQUEST_INVALID") {
        errorMessage("※入力内容に誤りがあります※");
      } else {
        errorMessage("※商品を登録できませんでした※");
      }
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

        <div className="message-area">
          {error && <p className="error-message">{error}</p>}
        </div>

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
            onChange={(e) => setCurrentStock(e.target.value)}
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
            onChange={(e) => setMinStock(e.target.value)}
          />
        </label>

        <label>
          並び順
          <input
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
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
