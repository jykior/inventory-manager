import "./Common.css";
import { Settings, House, Package, UserStar } from "lucide-react";

function Sidebar({ currentPage, setCurrentPage, setInitialStatus, user }) {
  return (
    <aside className="sidebar">
      <h1>INVENTORY MANAGER</h1>
      <img src="/logo.png" alt="Inventory Manager" className="logo" />

      <nav>
        <button
          className={currentPage === "home" ? "active" : ""}
          onClick={() => setCurrentPage("home")}
        >
          <House size={24} />
          ホーム
        </button>
        <button
          className={currentPage === "items" ? "active" : ""}
          onClick={() => {
            setInitialStatus("すべて");
            setCurrentPage("items");
          }}
        >
          <Package size={24} /> 商品一覧
        </button>
        <button
          className={currentPage === "setting" ? "active" : ""}
          onClick={() => setCurrentPage("setting")}
        >
          <Settings size={24} /> 設定
        </button>
        {user?.role === "ADMIN" && (
          <button
            className={currentPage === "admin" ? "active" : ""}
            onClick={() => setCurrentPage("admin")}
          >
            <UserStar size={24} /> ユーザー管理
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
