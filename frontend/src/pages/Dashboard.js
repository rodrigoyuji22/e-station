import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../css/dashboard.css";
import editIcon from "../assets/icons/edit_icon.png";
import deleteIcon from "../assets/icons/delete_icon.png";
import closeIcon from "../assets/icons/close_icon.png";

function Dashboard() {
  const [chargingSessions, setChargingSessions] = useState([]);
  const [chargingStations, setChargingStations] = useState([]);
  const [preferenceMode, setPreferenceMode] = useState("");
  const [preferenceBattery, setPreferenceBattery] = useState("");
  const [status, setStatus] = useState("");
  const [station, setstation] = useState("");
  const [isReciclable, setIsReciclable] = useState("");
  const [source, setSource] = useState("");

  const backToLogin = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

  function openEdit(id) {
    let sessionIdnput = document.getElementById("SessionIDInput");
    sessionIdnput.value = id;
    showModal("edit-session");
  }

  function handleEditSession(e) {
    e.preventDefault();
    const sessionId = document.getElementById("SessionIDInput").value;
    updateSession(
      sessionId,
      status,
      `${preferenceMode} | ${preferenceBattery}%`
    );
  }

  function handleCreateSession(e) {
    e.preventDefault();
    createSession(station, `${preferenceMode} | ${preferenceBattery}%`);
  }

  function handleCreateStation(e) {
    createStation(source, isReciclable);
  }

  async function updateSession(sessionId, status, preferences) {
    const token = localStorage.getItem("token");
    try {
      const response = await api.put(
        `/sessions/${sessionId}`,
        { status: status, preferences: preferences },
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("Sessão atualizada:", response.data);
      window.location.reload(true);
    } catch (error) {
      console.error("Erro ao atualizar a sessão:", error);
    }
  }

  async function createSession(station_id, preferences) {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/sessions",
        { station_id: station_id, preferences: preferences },
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("Sessão criada:", response.data);
      window.location.reload(true);
    } catch (error) {
      console.error("Erro ao criar a sessão:", error);
    }
  }

  async function createStation(source, isReciclable) {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/stations",
        { source: source, is_reciclable: isReciclable },
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("Estação criada:", response.data);
      window.location.reload(true);
    } catch (error) {
      console.error("Erro ao criar a estação:", error);
    }
  }

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/sessions", {
          headers: { Authorization: `${token}` },
        });
        setChargingSessions(response.data);
      } catch (error) {
        console.error("Erro ao buscar sessões de recarga:", error);
        window.location.href = "/login";
      }
    };
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/stations", {
          headers: { Authorization: `${token}` },
        });
        setChargingStations(response.data);
      } catch (error) {
        console.error("Erro ao buscar locais de recarga:", error);
        window.location.href = "/login";
      }
    };

    fetchSessions();
    fetchStations();
  }, []);

  return (
    <div className="content">
      <div className="table-container">
        <button onClick={backToLogin}>Return to Login</button>
        <button onClick={() => showModal("add-session")}>
          Add New Session
        </button>
        <button onClick={() => showModal("add-station")}>
          Add New Station
        </button>
        <table>
          <thead>
            <tr>
              <th>Station</th>
              <th>Settings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargingSessions.map((session) => (
              <tr key={session.id}>
                <td>{session.station}</td>
                <td>{session.preferences}</td>
                <td>{session.status}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => openEdit(session.id)}>
                      <img src={editIcon} alt="" />
                    </button>
                    <button
                      onClick={() =>
                        updateSession(session.id, "canceled", null)
                      }
                    >
                      <img src={deleteIcon} alt="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal-base" id="edit-session" hidden>
        <header>
          <h1 id="edit-session-header">Edit Session</h1>
          <button onClick={() => closeModal("edit-session")}>
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className="modal-content">
          <form onSubmit={handleEditSession}>
            <input type="number" id="SessionIDInput" name="userID" hidden />
            <strong>Preferences</strong>
            <div className="modal-content-row">
              <label htmlFor="preference-mode">
                <span>Mode:</span>
                <select
                  name="preference-mode"
                  onChange={(e) => setPreferenceMode(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="quick-charge">quick-charge</option>
                  <option value="smart-charge">smart-charge</option>
                  <option value="adaptive-charge">adaptive-charge</option>
                  <option value="standard-charge">standard-charge</option>
                </select>
              </label>
              <label htmlFor="preference-battery">
                <span>Battery limit:</span>
                <select
                  name="preference-battery"
                  onChange={(e) => setPreferenceBattery(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="10">10%</option>
                  <option value="25">25%</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                </select>
              </label>
            </div>
            <div className="modal-content-row">
              <label htmlFor="status">
                <span>Current status:</span>
                <select
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="pending">Pending</option>
                  <option value="onGoing">onGoing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
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
      <div className="modal-base" id="add-session" hidden>
        <header>
          <h1 id="add-session-header">Edit Session</h1>
          <button onClick={() => closeModal("add-session")}>
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className="modal-content">
          <form onSubmit={handleCreateSession}>
            <strong>Preferences</strong>
            <div className="modal-content-row">
              <label htmlFor="preference-mode">
                <span>Mode:</span>
                <select
                  name="preference-mode"
                  onChange={(e) => setPreferenceMode(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="quick-charge">quick-charge</option>
                  <option value="smart-charge">smart-charge</option>
                  <option value="adaptive-charge">adaptive-charge</option>
                  <option value="standard-charge">standard-charge</option>
                </select>
              </label>
              <label htmlFor="preference-battery">
                <span>Battery limit:</span>
                <select
                  name="preference-battery"
                  onChange={(e) => setPreferenceBattery(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="10">10%</option>
                  <option value="25">25%</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                </select>
              </label>
            </div>
            <div className="modal-content-row">
              <label htmlFor="station">
                <span>Current status:</span>
                <select
                  name="station"
                  onChange={(e) => setstation(e.target.value)}
                >
                  <option value="null">-</option>
                  {chargingStations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.source}
                    </option>
                  ))}
                </select>
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
      <div className="modal-base" id="add-station" hidden>
        <header>
          <h1 id="add-session-header">Add Station</h1>
          <button onClick={() => closeModal("add-station")}>
            <img src={closeIcon} alt="Close" />
          </button>
        </header>
        <div className="modal-content">
          <form onSubmit={handleCreateStation}>
            <strong>Info</strong>
            <div className="modal-content-row">
              <label htmlFor="source-name">
                <span>Source:</span>
                <input
                  name="source-name"
                  onChange={(e) => setSource(e.target.value)}
                />
              </label>
              <label htmlFor="Reciclable-select">
                <span>Reciclable:</span>
                <select
                  name="Reciclable-select"
                  onChange={(e) => setIsReciclable(e.target.value)}
                >
                  <option value="null">-</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
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

export default Dashboard;
