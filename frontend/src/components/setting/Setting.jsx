import { useState } from "react";
import { deleteAccount, updateEmail, updatePassword } from "../../api/authApi";
import { Megaphone, UserPen, Settings } from "lucide-react";
import "./Setting.css";

function Setting({ user, onUserUpdated, onAccountDeleted }) {
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type) => {
    setMessage({ text: text, type: type });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      showMessage("メールアドレスを入力してください", "error");
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showMessage("正しいメールアドレスを入力してください", "error");
      return;
    }
    try {
      const updatedUser = await updateEmail(email);
      onUserUpdated(updatedUser);
      setEmail("");
      setIsEmailModalOpen(false);
      showMessage("パスワードを変更しました", "success");
    } catch (error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        showMessage("このメールアドレスはすでに登録されています", "error");
        return;
      }

      showMessage("メールアドレスの変更に失敗しました", "error");
    }
  };
  /**
   * パスワード変更を行う。
   *
   * 入力内容をチェックし、パスワードを変更した後にモーダルを閉じる。
   */
  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      showMessage("未入力の項目があります", "error");
      return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#]{6,}$/;
    if (!passwordPattern.test(password)) {
      showMessage("パスワードは6文字以上の英数字で入力してください", "error");
      return;
    }
    if (password !== confirmPassword) {
      showMessage("パスワードが一致していません", "error");
      return;
    }
    try {
      await updatePassword(password);

      setPassword("");
      setConfirmPassword("");
      setIsPasswordModalOpen(false);
      showMessage("パスワードを変更しました", "success");
    } catch (error) {
      if (error.message === "SAME_PASSWORD") {
        showMessage("現在と同じパスワードは設定できません", "error");
        return;
      }

      showMessage("パスワードの変更に失敗しました", "error");
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    onAccountDeleted();
  };

  return (
    <div>
      <h1 className="page-title">
        <Settings size={32} />
        設定
      </h1>
      <div className="message-area">
        {message.type === "success" && (
          <p className="success-message">{message.text}</p>
        )}
      </div>

      <div className="setting-list">
        <div className="setting-card">
          <div className="setting-card-title">
            <span className="setting-icon">
              <UserPen size={24} />
            </span>
            <h2>アカウント設定</h2>
          </div>
          <div className="setting-item">
            <span className="setting-label">メールアドレス</span>
            <span className="setting-value">{user?.email}</span>
            <button
              onClick={() => {
                setEmail("");
                setIsEmailModalOpen(true);
              }}
            >
              編集
            </button>
          </div>

          <div className="setting-item">
            <span className="setting-label">パスワード</span>
            <span className="setting-value">********</span>
            <button onClick={() => setIsPasswordModalOpen(true)}>編集</button>
          </div>

          <div className="setting-item account-delete">
            <button
              className="delete-account-button"
              onClick={() => setIsDeleteAccountModalOpen(true)}
            >
              退会する
            </button>
          </div>

          {isEmailModalOpen && (
            <div className="modal-overlay">
              <div className="account-modal">
                <h3>メールアドレス変更</h3>

                <p>新しいメールアドレス</p>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {message.type === "error" && (
                  <p className="password-message">{message.text}</p>
                )}

                <div className="account-modal-buttons">
                  <button
                    onClick={() => {
                      setEmail("");
                      setIsEmailModalOpen(false);
                    }}
                  >
                    キャンセル
                  </button>

                  <button className="save-button" onClick={handleUpdateEmail}>
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPasswordModalOpen && (
            <div className="modal-overlay">
              <div className="account-modal">
                <h3>パスワード変更</h3>

                <p>新しいパスワード</p>

                <input
                  type="password"
                  placeholder="6文字以上の英数字で入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="password-note">
                  <div>※ 英字・数字を必ず含む6文字以上で入力してください。</div>
                  <div>使用できる記号：! @ #</div>
                </div>

                <p>パスワード（確認）</p>

                <input
                  type="password"
                  placeholder="もう一度入力してください"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {message.type === "error" && (
                  <p className="password-message">{message.text}</p>
                )}

                <div className="account-modal-buttons">
                  <button onClick={() => setIsPasswordModalOpen(false)}>
                    キャンセル
                  </button>

                  <button
                    className="save-button"
                    onClick={handleUpdatePassword}
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          )}

          {isDeleteAccountModalOpen && (
            <div className="modal-overlay">
              <div className="delete-modal">
                <h3>本当に退会しますか？</h3>
                <div className="delete-modal-buttons">
                  <button onClick={() => setIsDeleteAccountModalOpen(false)}>
                    キャンセル
                  </button>
                  <button
                    className="delete-account-button"
                    onClick={handleDeleteAccount}
                  >
                    退会する
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="setting-card">
          <div className="setting-card-title">
            <span className="setting-icon">
              <Megaphone size={24} />
            </span>
            <h2>通知設定</h2>
          </div>
          <div className="setting-item">
            <span className="setting-label">通知方法</span>
            <select className="setting-alert">
              <option value="">アプリ内通知</option>
              <option value="">メール通知</option>
            </select>
          </div>

          <div className="setting-item">
            <span className="setting-label">通知状態</span>
            <select className="setting-alert">
              <option value="">ON</option>
              <option value="">OFF</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Setting;
