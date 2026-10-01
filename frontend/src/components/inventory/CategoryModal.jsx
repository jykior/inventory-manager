import { useState } from "react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategory } from "../../api/itemApi";

function CategoryModal({ categories, allItems, onClose, onCategoriesChanged }) {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDeleteCategory = async () => {
    await deleteCategory(selectedCategory.id);
    await onCategoriesChanged();

    setIsDeleteCategoryModalOpen(false);
    selectedCategory(null);
  };

  return (
    <div className="modal-overlay">
      <div className="category-modal">
        <div className="category-header">
          <div>
            <h2>カテゴリ管理</h2>
            <p>カテゴリの追加・編集・削除ができます。</p>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>カテゴリ名</th>
                <th>カラー</th>
                <th>商品数</th>
                <th>操作</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const itemCount = allItems.filter(
                  (item) => item.category?.id === category.id,
                ).length;

                return (
                  <tr key={category.id}>
                    <td>{category.name}</td>

                    <td>
                      <span style={{ color: category?.colorCode }}>◆</span>
                    </td>

                    <td>{itemCount} 商品</td>

                    <td>
                      <div className="category-actions">
                        <button
                          className="category-edit-button"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsEditCategoryModalOpen(true);
                          }}
                        >
                          ✎
                        </button>
                        <button
                          className="category-delete-button"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsDeleteCategoryModalOpen(true);
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          className="category-add-button"
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          ＋ カテゴリを追加
        </button>
      </div>
      {/*カテゴリ追加モーダル*/}
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddCategoryModalOpen(false)}
          onCategoryCreated={onCategoriesChanged}
        />
      )}

      {/*カテゴリ編集モーダル*/}
      {isEditCategoryModalOpen && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => {
            setIsEditCategoryModalOpen(false);
            setSelectedCategory(null);
          }}
          onCategoryChanged={onCategoriesChanged}
        />
      )}

      {isDeleteCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>このカテゴリを削除しますか？</h3>

            <div className="delete-modal-buttons">
              <button onClick={() => setIsDeleteCategoryModalOpen(false)}>
                キャンセル
              </button>

              <button
                className="delete-confirm-button"
                onClick={handleDeleteCategory}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryModal;
