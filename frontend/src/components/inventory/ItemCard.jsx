import { useState } from "react";
import { getStockStatus } from "../../utils/stockStatus";
import { deleteItem, updateStock as updateStockApi } from "../../api/itemApi";
import EditItemModal from "./EditItemModal";

/**
 * 商品情報を表示し、在庫の変更・入庫・編集・削除を行う。
 */
function ItemCard({
  item,
  categories,
  isSelected,
  onSelectItem,
  onUpdateStock,
  onItemsChanged,
}) {
  const [stockChange, setStockChange] = useState(0);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);

  const handleStockChange = async (item, newStock) => {
    const updatedStock = await updateStockApi(item, newStock);

    onUpdateStock(updatedStock);
  };

  const handleDeleteItem = async () => {
    await deleteItem(item.id);
    await onItemsChanged();

    setIsDeleteItemModalOpen(false);
  };

  const status = getStockStatus(item);

  return (
    <>
      <tr
        className="item"
        style={{
          backgroundColor: status.alertBackgroundColor,
        }}
        onClick={() => {
          onSelectItem(item.id);
          setStockChange(0);
        }}
      >
        <td>
          <span
            className="category-color"
            style={{ color: item.category?.colorCode }}
          >
            ◆
          </span>
        </td>
        <td>
          <span className="item-name">{item.name}</span>
        </td>

        <td>
          <span
            className="item-category"
            style={{ backgroundColor: item.category?.colorCode }}
          >
            {item.category?.name}
          </span>
        </td>

        <td>
          <div className="item-stock">
            {isSelected && (
              <button
                className="stock-control"
                onClick={(e) => {
                  e.stopPropagation();
                  setStockChange((prev) =>
                    Math.max(prev - 1, -item.currentStock),
                  );
                }}
                disabled={item.currentStock === 0}
              >
                −
              </button>
            )}
            <span className="stock-number">
              {isSelected && stockChange !== 0 && (
                <span className="stock-change">
                  {stockChange > 0 ? "+" : ""}
                  {stockChange}
                </span>
              )}
              <span>{item.currentStock}</span>
            </span>
            {isSelected && (
              <button
                className="stock-control"
                onClick={(e) => {
                  e.stopPropagation();
                  setStockChange((prev) => prev + 1);
                }}
              >
                ＋
              </button>
            )}
            {isSelected && (
              <button
                className="stock-decision"
                onClick={(e) => {
                  e.stopPropagation();
                  if (stockChange !== 0) {
                    handleStockChange(item, item.currentStock + stockChange);
                  }
                  setStockChange(0);
                  onSelectItem(null);
                }}
              >
                ✓
              </button>
            )}
          </div>
          <span>個</span>
        </td>

        <td>
          <span className="item-status" style={{ color: status.alertColor }}>
            ● {status.stockStatus}
          </span>
        </td>

        <td>
          {isSelected && (
            <div className="item-actions">
              <button
                className="item-stock-in-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStockChange(0);
                  setIsStockInModalOpen(true);
                }}
              >
                入庫
              </button>
              <button
                className="item-edit-button"
                onClick={() => {
                  setIsEditItemModalOpen(true);
                }}
              >
                ✎
              </button>
              <button
                className="item-delete-button"
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsDeleteItemModalOpen(true);
                }}
              >
                🗑
              </button>
            </div>
          )}
        </td>
      </tr>
      {/*商品編集モーダル*/}
      {isEditItemModalOpen && (
        <EditItemModal
          item={item}
          categories={categories}
          onClose={() => {
            setIsEditItemModalOpen(false);
          }}
          onItemChanged={onItemsChanged}
        />
      )}

      {/* 商品入庫モーダル */}
      {isStockInModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsStockInModalOpen(false);
          }}
        >
          <div
            className="stock-in-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="stock-in-modal-header">
              <h2>商品入庫</h2>

              <button
                className="close-button"
                onClick={() => {
                  setIsStockInModalOpen(false);
                }}
              >
                ×
              </button>
            </div>

            <div className="stock-in-info">
              <p>
                商品名：<span>{item.name}</span>
              </p>

              <p>
                現在庫：<span>{item.currentStock}個</span>
              </p>
            </div>

            <label className="stock-in-label">
              入庫数
              <input
                type="number"
                min="1"
                value={stockChange === 0 ? "" : stockChange}
                onChange={(e) => {
                  setStockChange(Number(e.target.value));
                }}
                placeholder="入庫数を入力"
              />
            </label>

            <div className="stock-in-modal-buttons">
              <button
                className="stock-in-cancel-button"
                onClick={() => {
                  setStockChange(0);
                  setIsStockInModalOpen(false);
                }}
              >
                キャンセル
              </button>

              <button
                className="stock-in-confirm-button"
                onClick={async () => {
                  if (stockChange <= 0) {
                    return;
                  }
                  await handleStockChange(
                    item,
                    item.currentStock + stockChange,
                  );
                  setStockChange(0);
                  setIsStockInModalOpen(false);
                  onSelectItem(null);
                }}
                disabled={stockChange <= 0}
              >
                入庫する
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 商品削除確認モーダル */}
      {isDeleteItemModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>この商品を削除しますか？</h3>

            <div className="delete-modal-buttons">
              <button onClick={() => setIsDeleteItemModalOpen(false)}>
                キャンセル
              </button>

              <button
                className="delete-confirm-button"
                onClick={handleDeleteItem}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ItemCard;
