import { useEffect, useState } from "react";
import "./App.css";
import { getItems, getCategories } from "./api/itemApi";
import { guestLogout } from "./api/authApi";
import { User } from "lucide-react";
import Items from "./components/inventory/Items";
import Sidebar from "./components/common/Sidebar";
import Login from "./components/auth/Login";
import Admin from "./components/admin/Admin";
import Home from "./components/home/Home";
import Setting from "./components/setting/Setting";

function App() {
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState("home");
  const [initialStatus, setInitialStatus] = useState("すべて");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchItems = async () => {
    const data = await getItems();
    setAllItems(data);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
      setIsLoggedIn(true);

      fetchItems();
      fetchCategories();
    }
  }, []);
  /**
   * ログイン成功時の処理を行う。
   *
   * ユーザー情報をstateとsessionStorageに保存し、
   * ログイン後に商品・カテゴリ一覧を取得する。
   */
  const handleLogin = async (user) => {
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("user", JSON.stringify(user));

    await fetchItems();
    await fetchCategories();
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  /**
   * ログアウト処理を行う。
   *
   * sessionStorageからユーザー情報を削除し、
   * ログイン状態をリセットする。
   */
  const handleLogout = async () => {
    if (user?.role === "GUEST") {
      await guestLogout();
    }

    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleAccountDeleted = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  /**
   * 在庫数変更後の商品をallItemsのstateに反映する。
   */
  const handleUpdateStock = (updatedItem) => {
    setAllItems((prevAllItems) =>
      prevAllItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  };

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
      />

      <div className="content-area">
        <header className="app-header">
          <div className="header-user">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <span className="user-name">{user?.nickName}</span>
            <button className="logout-button" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </header>
        <div className="main-area">
          {/*HOME画面*/}
          {currentPage === "home" && (
            <Home
              allItems={allItems}
              setCurrentPage={setCurrentPage}
              setInitialStatus={setInitialStatus}
            />
          )}

          {/* 商品一覧画面 */}
          {currentPage === "items" && (
            <>
              <Items
                allItems={allItems}
                categories={categories}
                onUpdateStock={handleUpdateStock}
                onItemsChanged={fetchItems}
                onCategoriesChanged={fetchCategories}
                initialStatus={initialStatus}
              />
            </>
          )}

          {currentPage === "setting" && (
            <Setting
              user={user}
              onUserUpdated={handleUserUpdated}
              onAccountDeleted={handleAccountDeleted}
            />
          )}

          {currentPage === "admin" && <Admin />}
        </div>
      </div>
    </div>
  );
}
export default App;
