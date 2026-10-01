import { useState } from "react";
import { getStockStatus } from "../../utils/stockStatus";
import { deleteItem, updateStock as updateStockApi } from "../../api/itemApi";

function ItemCard({
  item,
  onUpdateStock,
  isSelected,
  onSelectItem,
  onItemsChanged
}) {
  const [stockChange, setStockChange] = useState(0);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);

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
                    Math.max(prev - 1, -item.current_stock),
                  );
                }}
                disabled={item.current_stock === 0}
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
              <span>{item.current_stock}</span>
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
                    handleStockChange(item, item.current_stock + stockChange);
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
            <button
              className="item-delete"
              onClick={async (e) => {
                e.stopPropagation();
                setIsDeleteItemModalOpen(true);
              }}
            >
              🗑
            </button>
          )}
        </td>
      </tr>
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
