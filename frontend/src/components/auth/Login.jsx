import { useState } from "react";
import { login, guestLogin } from "../../api/authApi";
import { DoorOpen, KeyRound, Mail, UserPlus } from "lucide-react";
import UserRegisterModal from "./UserRegisterModal";
import "./Auth.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showUserRegister, setShowUserRegister] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text: text, type: type });

    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000);
  };
  /**
   * ログイン処理を行う。
   *
   * 入力内容をチェックし、
   * ログインした後にログイン情報をApp.jsxへ渡す。
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showMessage("メールアドレスを入力してください", "error");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      showMessage("正しいメールアドレスを入力してください", "error");
      return;
    }
    if (!password.trim()) {
      showMessage("パスワードを入力してください", "error");
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#]{6,}$/;
    if (!passwordPattern.test(password)) {
      showMessage("パスワードは6文字以上の英数字で入力してください", "error");
      return;
    }

    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (error) {
      if (error.message === "LOGIN_FAILED") {
        showMessage(
          "メールアドレスまたはパスワードが正しくありません",
          "error",
        );
      } else {
        showMessage("ログインに失敗しました", "error");
      }
    }
  };
  /**
   * ゲストログインを行う。
   *
   * ゲストログインした後にゲストログイン情報をApp.jsxへ渡す。
   */
  const handleGuestLogin = async () => {
    try {
      const user = await guestLogin();
      onLogin(user);
    } catch (error) {
      showMessage("ゲストログインに失敗しました", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-logo">
          <h1>INVENTORY</h1>
          <h2>MANAGER</h2>
        </div>

        <div className="login-line"></div>

        <h3>お店の在庫を一目で把握</h3>

        <p className="login-sub-title">在庫状況をいつでも正確に。</p>

        <form onSubmit={handleLogin} noValidate>
          <div className="login-field">
            <label>
              <span className="login-text">メールアドレス</span>
            </label>
            <div className="login-input">
              <span className="login-icon">
                <Mail size={24} />
              </span>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="login-field">
            <label>
              <span className="login-text">パスワード</span>
            </label>
            <div className="login-input">
              <span className="login-icon">
                <KeyRound size={24} />
              </span>
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message.text && (
            <p className={`login-message ${message.type}`}>{message.text}</p>
          )}

          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>

        <div className="login-divider">
          <span></span>
          <p>または</p>
          <span></span>
        </div>

        <div className="login-sub-buttons">
          <button
            type="button"
            className="user-register-button"
            onClick={() => setShowUserRegister(true)}
          >
            <span>
              <UserPlus size={22} />
            </span>
            新規登録
          </button>

          <button
            type="button"
            className="guest-button"
            onClick={handleGuestLogin}
          >
            <span>
              <DoorOpen size={22} />
            </span>
            ゲストログイン
          </button>
        </div>
      </div>

      {showUserRegister && (
        <UserRegisterModal
          onClose={() => setShowUserRegister(false)}
          onRegisterSuccess={() => {
            showMessage("ユーザー登録が完了しました。", "success");
          }}
        />
      )}
    </div>
  );
}
export default Login;
