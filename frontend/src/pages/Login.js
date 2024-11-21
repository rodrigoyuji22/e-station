import React, { useState } from "react";
import api from "../services/api";
import "../css/login.css";
import eletricCarImage from "../assets/images/imagem.png";
import closeIcon from "../assets/icons/close_icon.png";
import "bootstrap-icons/font/bootstrap-icons.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newusername, setnewUsername] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [error, setError] = useState("");

  function showModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = "block";
    modal.hidden = false;
  }

  function closeModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = "none";
    modal.hidden = true;
  }

  function ViewPassword() {
    var senhaInput = document.getElementById("password");
    var toggleButton = document.getElementById("button-show-password");
    if (senhaInput.type === "password") {
      senhaInput.type = "text";
      toggleButton.classList.remove("bi-eye-fill");
      toggleButton.classList.add("bi-eye-slash-fill");
    } else {
      senhaInput.type = "password";
      toggleButton.classList.remove("bi-eye-slash-fill");
      toggleButton.classList.add("bi-eye-fill");
    }
  }

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/register", {
        username: newusername,
        password: newpassword,
      });
      console.log(response);
      alert("Usuário cadastrado com sucesso!");
      closeModal("register-user");
    } catch (err) {
      setError(
        `Erro ao fazer login. Verifique as credenciais. 
        ${err}`
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", { username, password });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        `Erro ao fazer login. Verifique as credenciais. 
        ${err}`
      );
    }
  };

  return (
    <div>
      <div id="container">
        <article className="ilustration">
          <img src={eletricCarImage} alt="eletric-car" />
        </article>
        <div className="login-forms">
          <div className="login-container">
            <h1>E-Station</h1>
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <div className="inputgroup">
                <label htmlFor="username">
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="inputgroup">
                <label htmlFor="password">
                </label>
                <input
                  type="password"
                  value={password}
                  id="password"
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="bi bi-eye-fill"
                  id="button-show-password"
                  onClick={() => ViewPassword()}
                />
              </div>
              <a onClick={() => showModal("register-user")}>
                Sign Up
              </a>
              <button id="button-enter" className="login-btn" type="submit">
                Sign In
              </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>

      </div>
      <div className="modal-base" id="register-user" hidden>
        <header>
          <h1 id="register-user-header">Register</h1>
          <button onClick={() => closeModal("register-user")}>
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className="modal-content">
          <form onSubmit={handleRegisterUser}>
            <div className="modal-content-row">
              <label htmlFor="new-username">
                <span>Username:</span>
                <input
                  name="new-username"
                  onChange={(e) => setnewUsername(e.target.value)}
                />
              </label>
              <label htmlFor="new-password">
                <span>Password:</span>
                <input
                  name="new-password"
                  onChange={(e) => setnewPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="button-row">
              <button className="confirm" type="submit">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
