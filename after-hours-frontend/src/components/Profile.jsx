import React, { forwardRef, useState, useEffect } from "react";
import { User, Edit3, Save } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import axios from "axios";

// 1. ACCEPT 'setUser' AS A PROP HERE
const Profile = forwardRef(({ user, setUser }, ref) => {
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    ethnicity: "",
    hairColor: "",
    skinColor: "",
    eyeColor: "",
    bodyType: "",
    weight: "",
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!user) return;
    setFormData({
      age: user.age || "",
      sex: user.sex || "",
      ethnicity: user.ethnicity || "",
      hairColor: user.hairColor || "",
      skinColor: user.skinColor || "",
      eyeColor: user.eyeColor || "",
      bodyType: user.bodyType || "",
      weight: user.weight || "",
    });
    setAvatar(user.avatar || null);
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        { ...formData, avatar },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // --- THE FIX STARTS HERE ---
      // 1. Update the local form state
      setFormData({
        age: res.data.age || "",
        sex: res.data.sex || "",
        ethnicity: res.data.ethnicity || "",
        hairColor: res.data.hairColor || "",
        skinColor: res.data.skinColor || "",
        eyeColor: res.data.eyeColor || "",
        bodyType: res.data.bodyType || "",
        weight: res.data.weight || "",
      });
      setAvatar(res.data.avatar || null);

      // 2. UPDATE THE GLOBAL APP STATE AND LOCAL STORAGE
      // This ensures the data is remembered the next time you refresh or login
      const updatedUser = { ...user, ...res.data }; 
      setUser(updatedUser); 
      localStorage.setItem("userProfile", JSON.stringify(updatedUser)); 

      setIsEditing(false);
      alert("Profile saved successfully!");
      // --- THE FIX ENDS HERE ---

    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const displayName = () => {
    if (!user) return "Guest";
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.username) return user.username;
    return "Guest";
  };

  return (
    <div 
      className="profile-wrapper" 
      ref={ref}
      style={{
        border: `2px solid ${theme.accent}`,
        borderRadius: "12px",
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.fontFamily,
        maxWidth: "600px",
        width: "100%",
        height: "100%",    
        padding: "1.5rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <style>
        {`
          .profile-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            opacity: 0.9;
          }
          .profile-btn:active {
            transform: scale(0.95);
          }
        `}
      </style>

      <section 
        className="profile-card" 
        style={{ 
          width: "100%", 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "flex-start", 
          backgroundColor: "transparent",
          boxShadow: "none",
          padding: 0,
          border: "none"
        }}
      >
        
        {/* Avatar */}
        <div className="profile-avatar" style={{ position: "relative", width: "90px", margin: "0 auto 1rem auto" }}>
          {avatar ? (
            <img 
              src={avatar} 
              alt="Profile" 
              className="avatar-img" 
              style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${theme.accent}` }}
            />
          ) : (
            <div className="default-avatar" style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={48} color={theme.text} />
            </div>
          )}
          {isEditing && (
            <label className="avatar-edit-label" style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: theme.primary, padding: "6px", borderRadius: "50%", cursor: "pointer", color: theme.text }}>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              <Edit3 size={14} />
            </label>
          )}
        </div>

        {/* Name */}
        <h2 className="profile-username" style={{ 
          textAlign: "center", 
          color: theme.primary, 
          marginBottom: "1.5rem", 
          fontSize: "1.5rem", 
          fontWeight: "bold",
          marginTop: 0
        }}>
          {displayName()}
        </h2>

        {/* Attributes List */}
        <div className="profile-attributes" style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          marginBottom: "1.5rem"
        }}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="profile-attribute-row" style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              borderBottom: `1px solid ${theme.accent}40`, 
              paddingBottom: "8px",
              paddingTop: "4px"
            }}>
              <span className="attribute-label" style={{ 
                fontWeight: "600", 
                color: theme.primary, 
                textTransform: "capitalize", 
                fontSize: "0.95rem",
                width: "130px", 
                flexShrink: 0
              }}>
                {key === "weight" ? "Weight (lbs)" : key.replace(/([A-Z])/g, " $1")}
              </span>
              
              {isEditing ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="attribute-select"
                  style={{ 
                    flex: 1, 
                    width: "100%",
                    direction: "rtl", 
                    borderRadius: "6px", 
                    padding: "6px 10px", 
                    fontFamily: theme.fontFamily, 
                    backgroundColor: theme.background, 
                    color: theme.text, 
                    border: `1px solid ${theme.accent}`, 
                    fontSize: "0.9rem" 
                  }}
                >
                  <option value="">Select...</option>
                  {key === "age" && Array.from({ length: 83 }, (_, i) => i + 18).map(age => <option key={age} value={age}>{age}</option>)}
                  {key === "sex" && ["Male", "Female", "Other"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "ethnicity" && ["Caucasian", "African American", "Asian", "Hispanic", "Other"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "hairColor" && ["Black", "Brown", "Blonde", "Red", "Gray", "Other"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "skinColor" && ["Fair", "Light", "Medium", "Olive", "Brown", "Dark"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "eyeColor" && ["Brown", "Blue", "Green", "Hazel", "Gray", "Other"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "bodyType" && ["Slim", "Athletic", "Average", "Curvy", "Muscular", "Plus Size"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  {key === "weight" && Array.from({ length: 201 }, (_, i) => i + 100).map(w => <option key={w} value={w}>{w} lbs</option>)}
                </select>
              ) : (
                <span className="attribute-value" style={{ 
                  fontSize: "0.95rem",
                  flex: 1,
                  textAlign: "right", 
                  paddingLeft: "10px"
                }}>
                  {formData[key] || "—"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="profile-buttons" style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "0.8rem", 
          marginTop: "1rem" 
        }}>
          {isEditing ? (
            <>
              <button 
                className="save-btn profile-btn" 
                onClick={async () => { await saveProfile(); }}
                style={{
                  backgroundColor: theme.primary,
                  color: theme.text,
                  border: "none",
                  borderRadius: "0.8rem",
                  padding: "0.4rem 1.2rem",
                  fontWeight: "bold",
                  fontFamily: theme.fontFamily,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.9rem"
                }}
              >
                <Save size={14} /> Save
              </button>
              <button 
                className="cancel-btn profile-btn" 
                onClick={() => setIsEditing(false)}
                style={{
                  backgroundColor: "transparent",
                  color: theme.primary,
                  border: `2px solid ${theme.primary}`,
                  borderRadius: "0.8rem",
                  padding: "0.4rem 1.2rem",
                  fontWeight: "bold",
                  fontFamily: theme.fontFamily,
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              className="edit-btn profile-btn" 
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
                border: "none",
                borderRadius: "0.8rem",
                padding: "0.4rem 1.2rem",
                fontWeight: "bold",
                fontFamily: theme.fontFamily,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem"
              }}
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </section>
    </div>
  );
});

export default Profile;