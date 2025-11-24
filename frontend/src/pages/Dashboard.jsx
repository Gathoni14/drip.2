import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import "../styles.css";

export default function Dashboard() {
  const [moisture, setMoisture] = useState(0);
  const [valves, setValves] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    valveId: "",
    startTime: "",
    duration: "",
    days: []
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  const moistureChartRef = useRef(null);
  const moistureChartInstance = useRef(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Protect dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  // Initialize moisture chart
  useEffect(() => {
    if (moistureChartRef.current) {
      moistureChartInstance.current = new Chart(moistureChartRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Soil Moisture (%)",
              data: [],
              borderColor: "#2e7d32",
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          animation: false,
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }
  }, []);

  // Fetch latest moisture readings every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:5000/readings");
        const latestReadings = res.data;

        if (latestReadings.length > 0) {
          const newest = latestReadings[0];
          setMoisture(newest.value);

          const time = new Date(newest.createdAt).toLocaleTimeString();
          const chart = moistureChartInstance.current;

          if (chart) {
            if (chart.data.labels.length > 10) {
              chart.data.labels.shift();
              chart.data.datasets[0].data.shift();
            }
            chart.data.labels.push(time);
            chart.data.datasets[0].data.push(newest.value);
            chart.update();
          }
        }
      } catch (err) {
        console.error("Error fetching readings:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fetch valves
  const fetchValves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/valves");
      setValves(res.data);
    } catch (err) {
      console.error("Error fetching valves:", err);
    }
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/schedules");
      setSchedules(res.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  useEffect(() => {
    console.log("Fetched valves:", valves)
    fetchValves();
    fetchSchedules();
  }, []);

  // Toggle valve
  const toggleValve = async (valveId, currentState) => {
    try {
      await axios.post("http://localhost:5000/valves/set", {
        valveId,
        state: !currentState
      });
      fetchValves();
    } catch (err) {
      console.error("Failed to update valve:", err);
    }
  };

  // Add or update schedule
  const saveSchedule = async () => {
    try {
      if (!newSchedule.valveId || !newSchedule.startTime || !newSchedule.duration || newSchedule.days.length === 0) {
        alert("Please fill all fields");
        return;
      }

      if (editingScheduleId) {
        await axios.put(`http://localhost:5000/schedules/${editingScheduleId}`, newSchedule);
        setEditingScheduleId(null);
      } else {
        await axios.post("http://localhost:5000/schedules", newSchedule);
      }

      setNewSchedule({ valveId: "", startTime: "", duration: "", days: [] });
      fetchSchedules();
    } catch (err) {
      console.error("Failed to save schedule:", err);
    }
  };

  // Delete schedule
  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  // Edit schedule
  const startEditSchedule = (schedule) => {
    setEditingScheduleId(schedule._id);
    setNewSchedule({
      valveId: schedule.valveId?._id || "",
      startTime: schedule.startTime,
      duration: schedule.duration,
      days: schedule.days
    });
  };

  const toggleDay = (day) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <h1>💧 Drip Irrigation Dashboard</h1>
      <button className="logout-btn" onClick={logout}>Logout</button>

      {/* Moisture */}
      <div className="sensor-grid">
        <div className="card">
          <h3>Soil Moisture</h3>
          <p>{moisture} %</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <canvas ref={moistureChartRef}></canvas>
        </div>
      </div>

      {/* Valves */}
      <h2>Valves</h2>
      <div className="valve-grid">
        {valves.map(v => (
          <div key={v._id} className="card valve-card">
            <h4>{v.name}</h4>
            <p>Status: {v.status ? "Open" : "Closed"}</p>
            <button onClick={() => toggleValve(v._id, v.status)}>
              {v.status ? "Close" : "Open"}
            </button>
          </div>
        ))}
      </div>

      {/* Schedule Form */}
      <h2>{editingScheduleId ? "Edit Schedule" : "Add Schedule"}</h2>
      <div className="schedule-form">
        <select
          value={newSchedule.valveId}
          onChange={e => setNewSchedule(prev => ({ ...prev, valveId: e.target.value }))}
        >
          <option value="">Select Valve</option>
          {valves.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
        </select>

        <input
          type="time"
          value={newSchedule.startTime}
          onChange={e => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
        />

        <input
          type="number"
          min="1"
          placeholder="Duration (min)"
          value={newSchedule.duration}
          onChange={e => setNewSchedule(prev => ({ ...prev, duration: e.target.value }))}
        />

        <div className="days-selection">
          {daysOfWeek.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={newSchedule.days.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>

        <button onClick={saveSchedule}>{editingScheduleId ? "Update" : "Add"}</button>
      </div>

      {/* Schedule Table */}
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Valve</th>
            <th>Start Time</th>
            <th>Duration (min)</th>
            <th>Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(s => (
            <tr key={s._id}>
              <td>{s.valveId?.name}</td>
              <td>{s.startTime}</td>
              <td>{s.duration}</td>
              <td>{s.days.join(", ")}</td>
              <td>
                <button onClick={() => startEditSchedule(s)}>Edit</button>
                <button onClick={() => deleteSchedule(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
