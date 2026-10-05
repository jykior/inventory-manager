import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../api/authApi";
import { UserStar, Star } from "lucide-react";
import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type) => {
    setMessage({ text: text, type: type });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
  };
  /**
   * ユーザーの権限を変更する。
   *
   * 権限を更新した後、
   * usersのstateに変更内容を反映する。
   */
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);

      setUsers((users) =>
        users.map((user) => (user.id === id ? { ...user, role: role } : user)),
      );
      showMessage("権限を変更しました", "success");
    } catch {
      showMessage("権限の変更に失敗しました", "error");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getUsers();
      setUsers(userData);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="page-title">
        <UserStar size={32} /> ユーザー管理
      </h1>
      <div className="message-area">
        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ユーザー名</th>
            <th>権限</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>・ {user.nickname}</td>

              <td>
                {user.role === "ADMIN" ? (
                  <span className="admin-icon">
                    <Star size="22" color="#c7cf2e" />
                    ADMIN
                  </span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Admin;
