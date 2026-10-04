import "./Home.css";
import { getStockStatus } from "../../utils/stockStatus";
import {
  Boxes,
  ChevronsDown,
  CircleCheck,
  TriangleAlert,
  House,
} from "lucide-react";

function Home({ allItems, setCurrentPage, setInitialStatus }) {
  const normalItems = allItems.filter(
    (item) => getStockStatus(item).status === "正常",
  );
  const fewItems = allItems.filter(
    (item) => getStockStatus(item).status === "少ない",
  );
  const alertItems = allItems.filter(
    (item) => getStockStatus(item).status === "注意",
  );
  return (
    <>
      <div>
        <h1 className="page-title">
          {" "}
          <House size={32} />
          ホーム
        </h1>

        <div className="home-summary">
          <div className="summary-card">
            <div className="icon" style={{ color: " #b08d57" }}>
              <Boxes size={36} />
            </div>
            <div className="summary-text">
              <p style={{ color: " #b08d57" }}>全商品数</p>
              <div className="summary-number">
                <h2>{allItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#289046" }}>
              <CircleCheck size={36} />
            </div>
            <div className="summary-text">
              <p style={{ color: "#289046" }}>正常</p>
              <div className="summary-number">
                <h2>{normalItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#e8942f" }}>
              <ChevronsDown size={36} />
            </div>
            <div className="summary-text">
              <p style={{ color: "#e8942f" }}>少ない</p>
              <div className="summary-number">
                <h2>{fewItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#d93636" }}>
              <TriangleAlert size={36} />
            </div>
            <div className="summary-text">
              <p style={{ color: "#d93636" }}>注意</p>
              <div className="summary-number">
                <h2>{alertItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>
        </div>
        <div className="home-stock-list">
          <div className="home-alert">
            <h2>在庫注意の商品</h2>

            {alertItems.slice(0, 3).map((item) => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="alert-item">
                  <span
                    style={{
                      color: status.alertColor,
                    }}
                  >
                    ●
                  </span>
                  <span>{item.name}</span>
                  <span>{item.category.name}</span>
                  <span>{item.currentStock}個</span>
                  <span
                    style={{
                      color: status.alertColor,
                    }}
                  >
                    {status.status}
                  </span>
                </div>
              );
            })}
            <button
              onClick={() => {
                setInitialStatus("注意");
                setCurrentPage("items");
              }}
            >
              一覧を見る
            </button>
          </div>
          <div className="home-few">
            <h2>在庫が少ない商品</h2>

            {fewItems.slice(0, 3).map((item) => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="few-item">
                  <span
                    style={{
                      color: status.alertColor,
                    }}
                  >
                    ●
                  </span>
                  <span>{item.name}</span>
                  <span>{item.category.name}</span>
                  <span>{item.currentStock}個</span>
                  <span
                    style={{
                      color: status.alertColor,
                    }}
                  >
                    {status.status}
                  </span>
                </div>
              );
            })}
            <button
              onClick={() => {
                setInitialStatus("少ない");
                setCurrentPage("items");
              }}
            >
              一覧を見る
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
