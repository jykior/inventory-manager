import { useState } from "react";
import { updateCategory } from "../../api/itemApi";

function EditCategoryModal({ category, onClose, onCategoryChanged }) {
  const [name, setName] = useState(category.name);
  const [error, setError] = useState("");
  const [colorCode, setColorCode] = useState(category.colorCode);

  const colors = [
    "rgba(108, 195, 196, 0.5)",
    "rgba(230, 230, 14,0.5)",
    "rgba(103, 51, 246, 0.5)",
    "rgba(29, 201, 34,0.5)",
    "rgba(218, 133, 212,0.5)",
    "rgba(237, 127, 18,0.5)",
  ];
/**
 * カテゴリを更新する。
 *
 * 入力内容をチェックし、
 * カテゴリを更新した後に一覧を更新する。
 */
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("※カテゴリ名を入力してください※");
      return;
    }

  if (!colorCode) {
    setError("※カテゴリカラーを選択してください※");
    return;
  }
  
    try {
      await updateCategory(category.id, {
        name: name.trim(),
        colorCode: colorCode,
      });
      await onCategoryChanged();
      onClose();
    } catch (error) {
      if (error.message === "CATEGORY_FAILED") {
        setError("※権限がありません※");
      } else setError("※同じカテゴリ名がすでに登録されています※");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="category-form-modal">
        <div className="category-form-modal-header">
          <h2>カテゴリを編集</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

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
          保存する
        </button>
      </div>
    </div>
  );
}
export default EditCategoryModal;
