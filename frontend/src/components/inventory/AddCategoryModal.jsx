import { useState } from "react";
import { createCategory } from "../../api/itemApi";

function AddCategoryModal({ onClose, onCategoryCreated, onMessage }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [colorCode, setColorCode] = useState();

  const colors = [
    "rgba(108, 195, 196, 0.5)",
    "rgba(230, 230, 14,0.5)",
    "rgba(103, 51, 246, 0.5)",
    "rgba(29, 201, 34,0.5)",
    "rgba(218, 133, 212,0.5)",
    "rgba(237, 127, 18,0.5)",
  ];
  const errorMessage = (text) => {
    setError(text);
    setTimeout(() => setError(""), 5000);
  };
  /**
   * カテゴリを登録する。
   *
   * 入力内容をチェックし、
   * カテゴリを作成した後に一覧を更新する。
   */
  const handleSubmit = async () => {
    if (!name.trim()) {
      errorMessage("※カテゴリ名を入力してください※");
      return;
    }
    if (!colorCode) {
      errorMessage("※カテゴリカラーを選択してください※");
      return;
    }
    try {
      await createCategory({ name: name.trim(), colorCode: colorCode });
      await onCategoryCreated();
      onClose();
      onMessage("◎カテゴリを追加しました", "success");
    } catch (error) {
      if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
        errorMessage("※同じカテゴリ名がすでに登録されています※");
      } else if (error.message === "CATEGORY_REQUEST_INVALID") {
        errorMessage("※入力内容に誤りがあります。※");
      } else {
        errorMessage("※カテゴリを登録できませんでした。※");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="category-form-modal">
        <div className="category-form-modal-header">
          <h2>カテゴリを追加</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <label>
          カテゴリ名<span className="required"> *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          カテゴリカラ―<span className="required"> *</span>
        </label>

        <div className="category-color-list">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`category-color ${
                colorCode === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setColorCode(color)}
            />
          ))}
        </div>

        <button className="save-button" onClick={handleSubmit}>
          追加する
        </button>
      </div>
    </div>
  );
}
export default AddCategoryModal;
