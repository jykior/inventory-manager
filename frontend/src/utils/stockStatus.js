/**
 * 在庫数と最低在庫数から在庫状態を判定する。
 */
export const getStockStatus = (item) => {
  const stock = item.current_stock;
  const alert = item.minStock;

  if (stock >= alert + 3) {
    return { status: "正常", alertColor: "#289046" };
  }
  if (stock > alert) {
    return {
      status: "少ない",
      alertColor: "#e8942f",
      alertBackgroundColor: "#fff7ed",
      stockStatus: "少",
    };
  }
  return {
    status: "注意",
    alertColor: "#d93636",
    alertBackgroundColor: "#fff0ed",
    stockStatus: "注意",
  };
};

