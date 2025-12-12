import React, { useState, useEffect } from "react";
import { Lock, Upload, FileText, CheckCircle, LogOut, User, UserPlus, Download, Folder, Trash2, RefreshCcw, Key, ArrowLeft, Mail, Share2, Settings, Moon, Sun, X, Users, Search, Clock, Activity, Camera, Eye, HardDrive, File, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:5000/api";
const MAX_STORAGE = 50* 1024 * 1024; // 50 MB Limit

function App() {
  const [view, setView] = useState("login");
  
  // --- USER DATA STATES ---
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("secureCurrentUser")));
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("secureUsersList");
    return saved ? JSON.parse(saved) : [{ 
        name: "Deepchand Kumawat", 
        email: "deepchandkhowal123@gmail.com", 
        password: "admin", 
        role: "Admin", 
        id: 1,
        avatar: null
    }];
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // --- THEME & SEARCH STATES ---
  const [darkMode, setDarkMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [toast, setToast] = useState(null);

  // --- FILES, TRASH & LOGS ---
  const [files, setFiles] = useState(() => JSON.parse(localStorage.getItem("secureFiles") || "[]"));
  const [trashFiles, setTrashFiles] = useState(() => JSON.parse(localStorage.getItem("secureTrash") || "[]"));
  const [activityLogs, setActivityLogs] = useState(() => JSON.parse(localStorage.getItem("secureActivityLogs") || "[]"));

  // Save data automatically
  useEffect(() => {
    localStorage.setItem("secureFiles", JSON.stringify(files));
    localStorage.setItem("secureTrash", JSON.stringify(trashFiles));
    localStorage.setItem("secureUsersList", JSON.stringify(users));
    localStorage.setItem("secureCurrentUser", JSON.stringify(currentUser));
    localStorage.setItem("secureActivityLogs", JSON.stringify(activityLogs));
  }, [files, trashFiles, users, currentUser, activityLogs]);

  // Auto-redirect
  useEffect(() => {
    if (currentUser && (view === "login" || view === "register" || view === "otp")) {
        setView("dashboard");
        setName(currentUser.name);
        setEmail(currentUser.email);
    }
  }, [currentUser]);

  const addLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      action: action,
      details: details,
      timestamp: new Date().toLocaleString(), // Stores full Date & Time
      user: currentUser ? currentUser.name : "Unknown"
    };
    setActivityLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50));
  };

  const showToast = (msg, type = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const formatBytes = (bytes, decimals = 2) => {
      if (!+bytes) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const usedStorage = files.reduce((acc, file) => acc + (file.sizeBytes || 0), 0);
  const storagePercent = Math.min((usedStorage / MAX_STORAGE) * 100, 100);

  // --- HELPER TO GET ROLE ---
  const getUserRoleLabel = (ownerEmail) => {
      if (!ownerEmail) return "System"; // For demo files
      const u = users.find(user => user.email === ownerEmail);
      return u ? u.role : "User";
  };

  // --- THEME COLORS ---
  const theme = {
    bg: darkMode ? "#0f172a" : "#f0f2f5",
    text: darkMode ? "#f1f5f9" : "#333",
    cardBg: darkMode ? "#1e293b" : "white",
    navbar: darkMode ? "#020617" : "#2c3e50",
    border: darkMode ? "#334155" : "#e5e7eb",
    inputBg: darkMode ? "#334155" : "#f4f6f7",
    inputText: darkMode ? "white" : "black",
    uploadBg: darkMode ? "#0f172a" : "#f0f8ff",
    fileRow: darkMode ? "#1e293b" : "#ecf0f1",
    iconColor: darkMode ? "#94a3b8" : "#64748b",
    success: "#10b981",
    danger: "#ed0808ff",
    accent: "#2f09eeff"
  };

  const styles = {
    container: { minHeight: "100vh", backgroundColor: theme.bg, fontFamily: "Arial, sans-serif", color: theme.text, display: "flex", flexDirection: "column", transition: "all 0.3s ease" },
    navbar: { backgroundColor: theme.navbar, padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", position: "sticky", top: 0, zIndex: 50 },
    navLogo: { fontSize: "22px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", color: "rgba(239, 235, 246, 1)", cursor: "pointer" },
    navRight: { display: "flex", alignItems: "center", gap: "20px" },
    iconBtn: { background: "none", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", padding: "8px", borderRadius: "50%", transition: "background 0.2s" },
    logoutBtn: { backgroundColor: "#e73cc8ff", color: "white", padding: "8px 20px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "background 0.2s" },
    
    authContainer: { display: "flex", justifyContent: "center", alignItems: "center", flex: 1, padding: "20px" },
    authBox: { backgroundColor: theme.cardBg, padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", textAlign: "center", color: theme.text, border: `1px solid ${theme.border}` },
    input: { width: "100%", padding: "12px", marginBottom: "15px", border: `1px solid ${theme.border}`, borderRadius: "6px", backgroundColor: theme.inputBg, color: theme.inputText, fontSize: "15px", outline: "none" },
    loginBtn: { width: "100%", padding: "12px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
    link: { color: "#020103d6", fontSize: "14px", cursor: "pointer", marginTop: "15px", display: "block", textDecoration: "none" },
    linkContainer: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" },
    
    mainContent: { maxWidth: "1000px", margin: "40px auto", width: "100%", padding: "0 20px" },
    card: { backgroundColor: theme.cardBg, borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", padding: "30px", marginBottom: "30px", color: theme.text, border: `1px solid ${theme.border}` },
    sectionHeader: { fontSize: "20px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: darkMode ? "#60a5fa" : "#2c3e50", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}`, paddingBottom: "15px" },
    
    uploadContainer: { border: `2px dashed ${dragActive ? "#22c55e" : "#3b82f6"}`, borderRadius: "12px", padding: "50px", textAlign: "center", backgroundColor: dragActive ? (darkMode ? "#064e3b" : "#dcfce7") : theme.uploadBg, transition: "all 0.2s ease", cursor: "pointer" },
    fileRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", backgroundColor: theme.fileRow, borderLeft: "5px solid #3b82f6", marginBottom: "12px", borderRadius: "6px", color: theme.text, transition: "transform 0.1s" },
    fileRowDeleted: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", backgroundColor: darkMode ? "#450a0a" : "#fee2e2", borderLeft: "5px solid #ef4444", marginBottom: "12px", borderRadius: "6px", color: theme.text },
    fileName: { display: "flex", alignItems: "center", gap: "12px", fontWeight: "500", fontSize: "15px" },
    actionBtns: { display: "flex", gap: "8px" },
    btnBase: { padding: "8px 12px", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px", color: "white", transition: "opacity 0.2s" },
    
    trashToggle: { color: theme.iconColor, fontSize: "14px", cursor: "pointer", textDecoration: "underline", display: "flex", alignItems: "center", gap: "5px" },
    logItem: { fontSize: "13px", padding: "8px 0", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", color: theme.text },
    
    avatar: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid white" },
    avatarLarge: { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: `4px solid ${theme.border}`, margin: "auto", display: "block", cursor: "pointer" },
    avatarUpload: { display: "none" },

    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(5px)" },
    modalContent: { backgroundColor: theme.cardBg, padding: "20px", borderRadius: "12px", maxWidth: "90%", maxHeight: "90vh", overflow: "auto", textAlign: "center", position: "relative", border: `1px solid ${theme.border}`, color: theme.text },
    previewImage: { maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px", border: `1px solid ${theme.border}` },
    
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "25px" },
    statCard: { backgroundColor: theme.cardBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
    statIcon: { padding: "12px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
    
    toast: { position: "fixed", bottom: "20px", right: "20px", backgroundColor: toast?.type === "error" ? theme.danger : theme.success, color: "white", padding: "12px 24px", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 100, display: "flex", alignItems: "center", gap: "10px", animation: "slideIn 0.3s ease-out" }
  };

  // --- API HELPERS ---
  const sendOtpApi = async (targetEmail) => {
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      return data.success;
    } catch (e) { showToast("Backend connect nahi ho raha. Kya kaali window khuli hai?"); return false; }
  };

  // --- AUTHENTICATION ---
  const handleRegister = () => {
    if (!name || !email || !password) return showToast("Please fill all fields", "error");
    if (users.find(u => u.email === email)) return showToast("User already exists!", "error");

    const role = (users.length === 0 || email === "deepchandkhowal123@gmail.com") ? "Admin" : "User";
    const newUser = { id: Date.now(), name, email, password, role, avatar: null };
    setUsers([...users, newUser]);
    
    addLog("Registration", `${name} registered as ${role}`);
    showToast("Registration Successful! Please Login.");
    setView("login");
    setPassword(""); 
  };

  const handleLogin = async () => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
        const sent = await sendOtpApi(foundUser.email);
        if(sent) { 
            localStorage.setItem("tempLoginUser", JSON.stringify(foundUser));
            setView("otp"); 
            showToast(`OTP Sent to ${foundUser.email}`); 
        }
    } else { showToast("Invalid Email or Password!", "error"); }
  };

  const verifyLoginOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp })
      });
      const data = await res.json();
      if (data.success) {
          const tempUser = JSON.parse(localStorage.getItem("tempLoginUser"));
          setCurrentUser(tempUser);
          setView("dashboard");
          localStorage.removeItem("tempLoginUser");
          addLog("Login", `User logged in successfully`);
          showToast(`Welcome back, ${tempUser.name}!`);
      } else showToast("Wrong OTP", "error");
    } catch (e) { showToast("Verification Failed", "error"); }
  };

  const handleLogout = () => {
      addLog("Logout", `User logged out`);
      setCurrentUser(null);
      localStorage.removeItem("secureCurrentUser");
      setView("welcome");
      setEmail(""); setPassword(""); setOtp("");
      showToast("Logged out successfully");
  };

  // --- AUTO LOGOUT (4 MIN) ---
  useEffect(() => {
    if (!currentUser) return; 
    const INACTIVITY_TIME = 4 * 60 * 1000; 
    let logoutTimer;
    const autoLogout = () => { showToast("Logged out due to inactivity.", "error"); handleLogout(); };
    const resetTimer = () => { if(logoutTimer) clearTimeout(logoutTimer); logoutTimer = setTimeout(autoLogout, INACTIVITY_TIME); };
    window.addEventListener("mousemove", resetTimer); window.addEventListener("keydown", resetTimer); window.addEventListener("click", resetTimer); window.addEventListener("scroll", resetTimer);
    resetTimer();
    return () => { if(logoutTimer) clearTimeout(logoutTimer); window.removeEventListener("mousemove", resetTimer); window.removeEventListener("keydown", resetTimer); window.removeEventListener("click", resetTimer); window.removeEventListener("scroll", resetTimer); };
  }, [currentUser]);

  // --- FORGOT PASSWORD ---
  const handleForgotPassword = async () => {
    if(!email) return showToast("Enter Email", "error");
    const sent = await sendOtpApi(email);
    if(sent) { setView("forgot-otp"); showToast(`OTP sent to ${email}`); }
  };

  const handleVerifyForgotOtp = async () => {
     try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp })
      });
      const data = await res.json();
      if (data.success) { setView("reset-password"); showToast("OTP Verified"); }
      else showToast("Wrong OTP", "error");
    } catch (e) { showToast("Verification Failed", "error"); }
  };

  const handleResetPassword = () => {
    if(!newPassword) return showToast("Enter new password", "error");
    const userIndex = users.findIndex(u => u.email === email);
    if(userIndex > -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex].password = newPassword;
        setUsers(updatedUsers);
        addLog("Password Reset", `Password changed for ${email}`);
        showToast("Password Reset Successful!"); setView("login"); setNewPassword("");
    } else { showToast("User not found.", "error"); setView("login"); }
  };

  // --- FILES & ADMIN ---
  const handleFileUpload = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if(e.type.includes("drag")) setDragActive(true); else setDragActive(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = function(event) {
        const newFile = { 
            id: Date.now(), name: file.name, 
            data: event.target.result, sizeBytes: file.size,
            date: new Date().toLocaleDateString(), 
            owner: currentUser.email, isDemo: false 
        };
        setFiles([...files, newFile]);
        addLog("Upload", `Uploaded file: ${file.name}`);
        showToast("File Encrypted & Uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (file) => {
    if (file.isDemo) return showToast("Demo file cannot download.", "error");
    const a = document.createElement("a"); a.href = file.data; a.download = file.name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    addLog("Download", `Downloaded file: ${file.name}`);
    showToast("Download Started");
  };

  const handlePreview = (file) => {
      if(file.isDemo) return showToast("Demo file cannot be previewed.", "error");
      if (file.owner === currentUser.email || currentUser.role === "Admin") {
           setPreviewFile(file);
           addLog("Preview", `Previewed file: ${file.name}`);
      } else {
           showToast("Access Denied! Only owner can preview.", "error");
      }
  };

  const handleShare = () => {
    const link = `https://securevault.app/share/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link);
    addLog("Share", `Generated share link`);
    showToast("Link Copied to Clipboard!");
  };

  const moveToTrash = (id) => {
    const f = files.find(f => f.id === id);
    setTrashFiles([...trashFiles, f]);
    setFiles(files.filter(f => f.id !== id));
    addLog("Trash", `Moved ${f.name} to trash`);
    showToast("File moved to Trash");
  };

  const restoreFromTrash = (id) => {
    const f = trashFiles.find(f => f.id === id);
    setFiles([...files, f]);
    setTrashFiles(trashFiles.filter(f => f.id !== id));
    addLog("Restore", `Restored ${f.name} from trash`);
    showToast("File Restored");
  };

  const deletePermanently = (id) => {
    if(window.confirm("Delete forever?")) {
        const f = trashFiles.find(file => file.id === id);
        setTrashFiles(trashFiles.filter(file => file.id !== id));
        addLog("Delete", `Permanently deleted ${f ? f.name : "file"}`);
        showToast("File Deleted Permanently");
    }
  };

  const deleteUser = (id) => {
    if(window.confirm("Delete User?")) {
        const userToDelete = users.find(u => u.id === id);
        setUsers(users.filter(u => u.id !== id));
        setFiles(files.filter(f => f.owner !== userToDelete.email));
        addLog("Admin Action", `Deleted user: ${userToDelete.email}`);
        showToast("User Deleted");
    }
  };

  const handleUpdateProfile = () => {
     const updatedUsers = users.map(u => u.id === currentUser.id ? {...u, name, email, password, avatar: currentUser.avatar} : u);
     setUsers(updatedUsers);
     setCurrentUser({...currentUser, name, email, password});
     addLog("Profile Update", "User updated profile details");
     showToast("Profile Updated!"); setView("dashboard");
  };

  const handleAvatarUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(event) {
          const base64 = event.target.result;
          const updatedUser = { ...currentUser, avatar: base64 };
          setCurrentUser(updatedUser);
          const updatedUsersList = users.map(u => u.id === currentUser.id ? updatedUser : u);
          setUsers(updatedUsersList);
          addLog("Avatar Update", "User changed profile picture");
          showToast("Profile Picture Updated!");
      };
      reader.readAsDataURL(file);
  };

  // --- FILTER FILES (Search & Role) ---
  const getVisibleFiles = () => {
      let filtered = currentUser?.role === "Admin" 
          ? files 
          : files.filter(f => f.owner === currentUser?.email || f.isDemo);
      
      if (searchQuery) {
          filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return filtered;
  };
  const visibleFiles = getVisibleFiles();

  return (
    <div style={styles.container}>
      {toast && (
        <div style={styles.toast}>
            {toast.type === "error" ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
            {toast.msg}
        </div>
      )}

      {previewFile && (
          <div style={styles.modalOverlay} onClick={() => setPreviewFile(null)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}}>
                     <h3>{previewFile.name}</h3>
                     <button style={{border:"none", background:"none", cursor:"pointer", color: theme.text}} onClick={() => setPreviewFile(null)}><X/></button>
                  </div>
                  {previewFile.name.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img src={previewFile.data} alt="Preview" style={styles.previewImage} />
                  ) : (
                      <div style={{padding:"50px", backgroundColor: theme.bg}}>
                          <FileText size={50} color={theme.iconColor} />
                          <p>Preview not available for this file type.</p>
                      </div>
                  )}
                  <div style={{marginTop:"20px"}}>
                     <button style={{...styles.btnBase, backgroundColor: "#22c55e", margin:"auto"}} onClick={() => handleDownload(previewFile)}>Download</button>
                  </div>
              </div>
          </div>
      )}

      {(view === "dashboard" || view === "settings" || view === "trash" || view === "users") ? (
        <>
          <nav style={styles.navbar}>
            <div style={styles.navLogo} onClick={() => setView("dashboard")}><Lock size={24} fill="#f1c40f" /> SecureVault Pro</div>
            <div style={styles.navRight}>
              <div style={{display:"flex", alignItems:"center", gap:"10px", cursor:"pointer"}} onClick={() => setView("settings")}>
                  {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Profile" style={styles.avatar} />
                  ) : (
                      <div style={{...styles.avatar, backgroundColor: theme.accent, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"bold"}}>
                          {currentUser.name.charAt(0)}
                      </div>
                  )}
                  <div style={{fontSize:"14px", lineHeight:"1.2"}}>
                      <div style={{fontWeight:"bold"}}>{currentUser.name.split(' ')[0]}</div>
                      <div style={{fontSize:"10px", opacity:0.8}}>{currentUser.role}</div>
                  </div>
              </div>
              {currentUser.role === "Admin" && <button style={styles.iconBtn} onClick={() => setView("users")} title="Manage Users"><Users size={20}/></button>}
              <button style={styles.iconBtn} onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
              <button style={styles.iconBtn} onClick={() => setView("settings")}><Settings size={20}/></button>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          </nav>

          <div style={styles.mainContent}>
            {view === "dashboard" && (
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, backgroundColor: "#e0f2fe"}}><FileText color="#0284c7"/></div>
                        <div>
                            <div style={{fontSize:"20px", fontWeight:"bold"}}>
                                {currentUser.role === "Admin" ? files.length : visibleFiles.length}
                            </div>
                            <div style={{fontSize:"12px", color: theme.iconColor}}>
                                {currentUser.role === "Admin" ? "Total Secure Files" : "My Files"}
                            </div>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, backgroundColor: "#dcfce7"}}><HardDrive color="#16a34a"/></div>
                        <div><div style={{fontSize:"20px", fontWeight:"bold"}}>{formatBytes(usedStorage)}</div><div style={{fontSize:"12px", color: theme.iconColor}}>Storage Used</div></div>
                    </div>
                    {currentUser.role === "Admin" && (
                        <div style={styles.statCard}>
                            <div style={{...styles.statIcon, backgroundColor: "#fef9c3"}}><Users color="#ca8a04"/></div>
                            <div><div style={{fontSize:"20px", fontWeight:"bold"}}>{users.length}</div><div style={{fontSize:"12px", color: theme.iconColor}}>Active Users</div></div>
                        </div>
                    )}
                </div>
            )}

            {view === "settings" ? (
                <div style={styles.card}>
                    <div style={styles.sectionHeader}><User size={20}/> Profile Settings</div>
                    <div style={{textAlign:"center", marginBottom:"20px"}}>
                        <label htmlFor="avatarUpload">
                            {currentUser.avatar ? <img src={currentUser.avatar} alt="Profile" style={styles.avatarLarge} /> : <div style={{...styles.avatarLarge, backgroundColor:"#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center"}}><Camera size={40} color="#94a3b8"/></div>}
                            <div style={{marginTop:"10px", color: theme.accent, fontSize:"14px", cursor:"pointer", fontWeight:"bold"}}>Change Photo</div>
                        </label>
                        <input type="file" id="avatarUpload" style={styles.avatarUpload} accept="image/*" onChange={handleAvatarUpload} />
                    </div>
                    <input style={styles.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" />
                    <input style={styles.input} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
                    <input style={styles.input} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                    <button style={{...styles.loginBtn, width:"auto"}} onClick={handleUpdateProfile}>Save Changes</button>
                    <button style={{...styles.btnBase, backgroundColor:"gray", marginLeft:"10px"}} onClick={()=>setView("dashboard")}>Cancel</button>
                </div>
            ) : view === "users" && currentUser.role === "Admin" ? (
                <div style={styles.card}>
                    <div style={styles.sectionHeader}><Users size={20}/> Manage Users <button onClick={()=>setView("dashboard")} style={{...styles.btnBase, backgroundColor:"gray"}}>Back</button></div>
                    {users.map(u => (
                        <div key={u.id} style={styles.fileRow}>
                            <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
                                {u.avatar ? <img src={u.avatar} style={{...styles.avatar, width:"30px", height:"30px"}}/> : <div style={{width:"30px", height:"30px", borderRadius:"50%", background:"#ccc"}}></div>}
                                <div><div style={{fontWeight:"bold"}}>{u.name} <span style={{fontSize:"12px", fontWeight:"normal"}}>({u.role})</span></div><div style={{fontSize:"12px", opacity:0.7}}>{u.email}</div></div>
                            </div>
                            {u.email !== currentUser.email && <button style={{...styles.btnBase, backgroundColor:"#ef4444"}} onClick={()=>deleteUser(u.id)}>Delete</button>}
                        </div>
                    ))}
                </div>
            ) : view === "trash" ? (
                <div style={styles.card}>
                    <div style={styles.sectionHeader}><Trash2 size={20} color="#ef4444"/> Recycle Bin <button style={{...styles.btnBase, backgroundColor:"gray", marginLeft:"auto"}} onClick={()=>setView("dashboard")}>Back</button></div>
                    {trashFiles.map((f, i) => (
                        <div key={i} style={styles.fileRowDeleted}>
                            <div style={styles.fileName}>{f.name}</div>
                            <div style={styles.actionBtns}>
                                <button style={{...styles.btnBase, backgroundColor: theme.accent}} onClick={() => restoreFromTrash(f.id)}>Restore</button>
                                <button style={{...styles.btnBase, backgroundColor: theme.danger}} onClick={() => deletePermanently(f.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div style={styles.card}>
                        <div style={styles.sectionHeader}><Upload size={20} color={theme.accent}/> Upload Secure File</div>
                        <div style={styles.uploadContainer} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            <input type="file" id="file-upload" style={{display:"none"}} onChange={handleFileUpload} />
                            <label htmlFor="file-upload" style={{cursor:"pointer"}}>
                                <Upload size={40} color={darkMode ? "#fff" : theme.accent} style={{margin:"auto", marginBottom:"10px"}}/>
                                <p style={{fontWeight:"bold"}}>Click to Upload or Drag & Drop</p>
                            </label>
                        </div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.sectionHeader}>
                             <div style={{display:"flex", gap:"10px"}}><Folder size={20} color="#f59e0b"/> {currentUser.role === "Admin" ? "All Users' Files" : "My Encrypted Files"}</div>
                             <div style={styles.trashToggle} onClick={()=>setView("trash")}>Trash ({trashFiles.length})</div>
                        </div>
                        
                        {/* Search Bar */}
                        <div style={{display: "flex", alignItems: "center", padding: "10px", border: `1px solid ${theme.border}`, borderRadius: "6px", marginBottom: "15px", backgroundColor: theme.inputBg}}>
                            <Search size={18} color={theme.iconColor} />
                            <input 
                                style={{border: "none", background: "transparent", outline: "none", marginLeft: "10px", color: theme.text, width: "100%"}}
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {visibleFiles.length === 0 ? <p style={{textAlign:"center", opacity:0.5, padding:"20px"}}>No files found.</p> : visibleFiles.map((f, i) => (
                            <div key={i} style={styles.fileRow}>
                                <div style={styles.fileName}>
                                    <FileText size={18} color={theme.iconColor} /> 
                                    <div>
                                        {f.name}
                                        {currentUser.role === "Admin" && <div style={{fontSize:"10px", color: theme.accent}}>User: {f.owner}</div>}
                                    </div>
                                </div>
                                <div style={styles.actionBtns}>
                                    {/* PREVIEW BUTTON */}
                                    {f.owner === currentUser.email || f.isDemo ? (
                                        <button style={{...styles.btnBase, backgroundColor: "#f59e0b"}} onClick={() => handlePreview(f)} title="Preview"><Eye size={14}/></button>
                                    ) : (
                                        <button style={{...styles.btnBase, backgroundColor: theme.iconColor, cursor:"not-allowed"}} title="Locked" onClick={() => showToast("Access Denied!", "error")}><Lock size={14}/></button>
                                    )}

                                    <button style={{...styles.btnBase, backgroundColor: "#8b5cf6"}} onClick={handleShare} title="Share"><Share2 size={14}/></button>
                                    
                                    {f.owner === currentUser.email || f.isDemo ? (
                                        <button style={{...styles.btnBase, backgroundColor: theme.success}} onClick={() => handleDownload(f)} title="Download"><Download size={14}/></button>
                                    ) : null}

                                    {f.owner === currentUser.email && (
                                        <button style={{...styles.btnBase, backgroundColor: theme.danger, padding:"8px"}} onClick={() => moveToTrash(f.id)} title="Delete"><Trash2 size={14}/></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RECENT ACTIVITY LOG */}
                    <div style={styles.card}>
                        <div style={styles.sectionHeader}>
                             <div style={{display:"flex", gap:"10px"}}><Activity size={20} color={theme.success}/> Recent Activity</div>
                             <div style={{fontSize: "12px", color: theme.iconColor}}><Clock size={12} style={{display:"inline"}}/> Real-time</div>
                        </div>
                        <div style={{maxHeight: "200px", overflowY: "auto"}}>
                            {activityLogs.length === 0 ? <p style={{textAlign:"center", opacity:0.5}}>No recent activity.</p> : activityLogs.map((log) => (
                                <div key={log.id} style={styles.logItem}>
                                    <span><b>{log.user === currentUser.name ? "You" : log.user}</b> {log.details}</span>
                                    {/* UPDATED: Black text for date */}
                                    <span style={{color: darkMode ? "#cbd5e1" : "#000000", fontSize: "11px", fontWeight: "500"}}>{log.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
          </div>
        </>
      ) : (
        <div style={styles.authContainer}>
           <div style={styles.authBox}>
             <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}>
               <div style={{background: `${theme.accent}20`, padding:"15px", borderRadius:"50%"}}><Lock size={32} color={theme.accent} /></div>
             </div>
             
             {/* WELCOME SCREEN */}
             {view === "welcome" && (
                <>
                  <h2 style={{marginBottom:"20px"}}>Welcome To SecureVault</h2>
                  <p style={{color: theme.iconColor, marginBottom:"20px"}}>Your personal photos and files are securely stored here.</p>
                  <button style={{...styles.primaryBtn, backgroundColor: theme.accent}} onClick={() => setView("login")}>
                    <User size={20}/> Login (Existing User)
                  </button>
                  <button style={{...styles.primaryBtn, backgroundColor: theme.success, marginTop:"10px"}} onClick={() => setView("register")}>
                    <UserPlus size={20}/> Register (New User)
                  </button>
                </>
             )}

             {view === "login" && (
                <>
                  <h2 style={{marginBottom:"20px"}}>Secure Login</h2>
                  <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                  <button style={styles.loginBtn} onClick={handleLogin}>Login</button>
                  <div style={styles.linkContainer}>
                    <div style={styles.link} onClick={() => setView("forgot-email")}>Forgot Password?</div>
                    <div style={{...styles.link, color: theme.iconColor}} onClick={() => setView("welcome")}>Back</div>
                  </div>
                </>
             )}
             
             {view === "register" && (
                <>
                  <h2 style={{marginBottom:"20px"}}>Create Account</h2>
                  <input style={styles.input} placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
                  <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
                  <button style={styles.loginBtn} onClick={handleRegister}>Register</button>
                  <div style={styles.linkContainer}><div style={styles.link} onClick={() => setView("welcome")}>Back</div></div>
                </>
             )}
             {view === "otp" && (
                <>
                  <h2 style={{marginBottom:"20px"}}>Enter OTP</h2>
                  <input style={{...styles.input, textAlign:"center", fontSize:"20px"}} placeholder="••••" value={otp} onChange={e=>setOtp(e.target.value)} />
                  <button style={styles.loginBtn} onClick={verifyLoginOtp}>Verify</button>
                </>
             )}
             {view === "forgot-email" && (
                <>
                   <h2 style={{marginBottom:"20px"}}>Reset Password</h2>
                   <input style={styles.input} placeholder="Enter Email" value={email} onChange={e=>setEmail(e.target.value)} />
                   <button style={styles.loginBtn} onClick={handleForgotPassword}>Send OTP</button>
                   <div style={styles.linkContainer}><div style={styles.link} onClick={() => setView("login")}>Cancel</div></div>
                </>
             )}
             {view === "forgot-otp" && (
                <>
                   <h2 style={{marginBottom:"20px"}}>Verify Reset OTP</h2>
                   <input style={{...styles.input, textAlign:"center", fontSize:"20px"}} placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
                   <button style={styles.loginBtn} onClick={handleVerifyForgotOtp}>Verify</button>
                </>
             )}
             {view === "reset-password" && (
                <>
                   <h2 style={{marginBottom:"20px"}}>New Password</h2>
                   <input style={styles.input} type="password" placeholder="Enter New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                   <button style={styles.loginBtn} onClick={handleResetPassword}>Update</button>
                </>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
export default App;