import { useState } from "react";
import { createItem } from "../../api/itemApi";
import AddCategoryModal from "./AddCategoryModal";

function AddItemModal({
  categories,
  onClose,
  onItemCreated,
  onCategoriesChanged,
  onMessage,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [minStock, setMinStock] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };
  /**
   * 商品を登録する。
   *
   * 入力内容をチェックし、
   * 商品を作成した後に商品一覧を更新する。
   */
  const handleSubmit = async () => {
    if (!name.trim()) {
      showMessage("※商品名を入力してください※", "error");
      return;
    }
    if (!category) {
      showMessage("※カテゴリを選択してください※", "error");
      return;
    }
    if (currentStock === "") {
      showMessage("※現在の在庫数を入力してください※", "error");
      return;
    }
    if (alertEnabled && minStock === "") {
      showMessage("※アラート数を入力してください※", "error");
      return;
    }
    try {
      const item = {
        name: name.trim(),
        categoryId: Number(category),
        currentStock: Number(currentStock),
        minStock: minStock === "" ? null : Number(minStock),
        alertEnabled,
        sortOrder: sortOrder === "" ? null : Number(sortOrder),
      };

      await createItem(item);
      await onItemCreated();
      onClose();
      onMessage("◎商品を追加しました", "success");
    } catch (error) {
      if (error.message === "ITEM_NAME_ALREADY_EXISTS") {
        showMessage("※同じ商品名がすでに登録されています※", "error");
      } else if (error.message === "CATEGORY_NOT_FOUND") {
        showMessage("※カテゴリが見つかりません※", "error");
      } else if (error.message === "ITEM_REQUEST_INVALID") {
        showMessage("※入力内容に誤りがあります※", "error");
      } else {
        showMessage("※商品を登録できませんでした※", "error");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="item-modal">
        <div className="item-modal-header">
          <h2>商品を追加</h2>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="message-area">
          {message.text && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}
        </div>

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

      {/*カテゴリ追加モーダル*/}
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryModalOpen(false)}
          onCategoryCreated={onCategoriesChanged}
          onMessage={showMessage}
        />
      )}
    </div>
  );
}

export default AddItemModal;
