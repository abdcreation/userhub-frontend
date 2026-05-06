import { useState } from "react";

const DEPARTMENTS = ["Engineering", "Design", "Operations", "Marketing", "Product", "Unassigned"];
const ROLES = ["Admin", "Member", "Viewer"];
const STATUSES = ["Active", "Paused", "Complete"];

const PERMS = {
  Admin: {
    "View all members": true, "Edit member info": true, "Add new members": true,
    "Delete members": true, "Change roles": true, "Manage departments": true,
    "Export data": true, "View reports": true,
  },
  Member: {
    "View all members": true, "Edit member info": true, "Add new members": false,
    "Delete members": false, "Change roles": false, "Manage departments": false,
    "Export data": false, "View reports": true,
  },
  Viewer: {
    "View all members": true, "Edit member info": false, "Add new members": false,
    "Delete members": false, "Change roles": false, "Manage departments": false,
    "Export data": false, "View reports": false,
  },
};

const INITIAL_USERS = [
  {
    id: 1, name: "Emma Johnson", email: "emma.j@example.com",
    profession: "Product Designer", projectGoals: "Redesign user onboarding flow",
    phone: "+1 (555) 123-4567", location: "San Francisco, CA", joined: "Jan 2021",
    resume: "5 years building user-centered products at scale.",
    role: "Admin", department: "Design", status: "Active",
  },
  {
    id: 2, name: "Liam Chen", email: "liam.c@example.com",
    profession: "Frontend Developer", projectGoals: "Build React component library",
    phone: "+1 (555) 234-5678", location: "New York, NY", joined: "Mar 2022",
    resume: "React specialist. 20+ production apps shipped.",
    role: "Member", department: "Engineering", status: "Active",
  },
  {
    id: 3, name: "Ava Patel", email: "ava.p@example.com",
    profession: "Project Manager", projectGoals: "Streamline ops across 3 regions",
    phone: "+1 (555) 345-6789", location: "Austin, TX", joined: "Aug 2020",
    resume: "Led cross-functional teams of 15+ across time zones.",
    role: "Admin", department: "Operations", status: "Paused",
  },
];

const INITIAL_FEED = [
  { id: 1, type: "role", text: "Emma Johnson set as Admin", time: "2 min ago" },
  { id: 2, type: "add", text: "Ava Patel added to team", time: "1 hr ago" },
  { id: 3, type: "dept", text: "Liam Chen assigned to Engineering", time: "3 hrs ago" },
  { id: 4, type: "edit", text: "Emma Johnson profile updated", time: "Yesterday" },
];

const ACCENT_PALETTE = [
  { dot: "#f472b6", chip: "rgba(244,114,182,0.12)", text: "#f472b6" },
  { dot: "#34d399", chip: "rgba(52,211,153,0.12)", text: "#34d399" },
  { dot: "#fbbf24", chip: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  { dot: "#60a5fa", chip: "rgba(96,165,250,0.12)", text: "#60a5fa" },
  { dot: "#a78bfa", chip: "rgba(167,139,250,0.12)", text: "#a78bfa" },
];

const DEPT_COLORS = {
  Engineering: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  Design:      { bg: "rgba(244,114,182,0.12)", text: "#f472b6", border: "rgba(244,114,182,0.25)" },
  Operations:  { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  Marketing:   { bg: "rgba(52,211,153,0.12)",  text: "#34d399", border: "rgba(52,211,153,0.25)" },
  Product:     { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", border: "rgba(167,139,250,0.25)" },
  Unassigned:  { bg: "rgba(107,114,128,0.12)", text: "#6b7280", border: "rgba(107,114,128,0.25)" },
};

const ROLE_COLORS = {
  Admin:  { bg: "rgba(239,68,68,0.1)",   text: "#ef4444", border: "rgba(239,68,68,0.2)" },
  Member: { bg: "rgba(52,211,153,0.1)",  text: "#34d399", border: "rgba(52,211,153,0.2)" },
  Viewer: { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
};

const STATUS_COLORS = {
  Active:   { bg: "rgba(52,211,153,0.1)",  text: "#34d399", border: "rgba(52,211,153,0.2)" },
  Paused:   { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  Complete: { bg: "rgba(96,165,250,0.1)",  text: "#60a5fa", border: "rgba(96,165,250,0.2)" },
};

const FEED_DOT = {
  add: "#34d399", edit: "#a78bfa", del: "#ef4444", role: "#f472b6", dept: "#60a5fa",
};

const EMPTY_FORM = {
  name: "", email: "", profession: "", projectGoals: "",
  phone: "", location: "", joined: "", resume: "",
  role: "Member", department: "Unassigned", status: "Active",
};

function Toast({ msg, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 999,
      background: "#111", border: "1px solid #2d2d2d",
      color: "#e5e7eb", padding: "11px 18px", borderRadius: 10,
      fontSize: 13, fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 8,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.2s ease", pointerEvents: "none",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    }}>
      <span style={{ color: "#34d399", fontSize: 15 }}>✓</span>
      {msg}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "#0d0d0d", border: "1px solid #2d2d2d", borderRadius: 7,
  padding: "8px 10px", fontSize: 13, color: "#e5e7eb",
  fontFamily: "inherit", outline: "none", width: "100%",
  transition: "border-color 0.15s",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

function Chip({ label, colors }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, padding: "1px 6px",
      background: colors.bg, color: colors.text, borderRadius: 20,
      border: `1px solid ${colors.border}`, letterSpacing: "0.01em",
    }}>
      {label}
    </span>
  );
}

function EditForm({ data, onChange, onSave, onCancel, onDelete }) {
  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "profession", label: "Profession" },
    { key: "projectGoals", label: "Project Goals" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "joined", label: "Joined" },
  ];

  return (
    <div style={{ padding: "20px 24px", borderTop: "1px solid #1f1f1f", background: "#0a0a0a" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {fields.map(f => (
          <Field key={f.key} label={f.label}>
            <input
              style={inputStyle} type="text"
              value={data[f.key] || ""}
              onChange={e => onChange(f.key, e.target.value)}
              onFocus={e => (e.target.style.borderColor = "#34d399")}
              onBlur={e => (e.target.style.borderColor = "#2d2d2d")}
            />
          </Field>
        ))}
        <Field label="Role">
          <select style={selectStyle} value={data.role}
            onChange={e => onChange("role", e.target.value)}
            onFocus={e => (e.target.style.borderColor = "#34d399")}
            onBlur={e => (e.target.style.borderColor = "#2d2d2d")}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select style={selectStyle} value={data.department}
            onChange={e => onChange("department", e.target.value)}
            onFocus={e => (e.target.style.borderColor = "#34d399")}
            onBlur={e => (e.target.style.borderColor = "#2d2d2d")}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select style={selectStyle} value={data.status}
            onChange={e => onChange("status", e.target.value)}
            onFocus={e => (e.target.style.borderColor = "#34d399")}
            onBlur={e => (e.target.style.borderColor = "#2d2d2d")}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Bio / Resume">
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: "vertical", lineHeight: 1.5 }}
              value={data.resume}
              onChange={e => onChange("resume", e.target.value)}
              onFocus={e => (e.target.style.borderColor = "#34d399")}
              onBlur={e => (e.target.style.borderColor = "#2d2d2d")}
            />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={onSave} style={{
          background: "#34d399", color: "#000", border: "none", borderRadius: 7,
          padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", letterSpacing: "0.03em",
        }}>Save changes</button>
        <button onClick={onCancel} style={{
          background: "transparent", color: "#6b7280", border: "1px solid #2d2d2d",
          borderRadius: 7, padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}>Cancel</button>
        {onDelete && (
          <button onClick={onDelete} style={{
            marginLeft: "auto", background: "rgba(239,68,68,0.08)", color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7,
            padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}>Delete user</button>
        )}
      </div>
    </div>
  );
}

function TeamPage({ users, onRoleChange, onDeptChange, feed }) {
  const [activeTab, setActiveTab] = useState("departments");
  const [permRole, setPermRole] = useState("Admin");

  const grouped = DEPARTMENTS.reduce((acc, dept) => {
    const members = users.filter(u => u.department === dept);
    if (members.length) acc[dept] = members;
    return acc;
  }, {});

  const tabStyle = (name) => ({
    padding: "7px 14px", borderRadius: 7, fontSize: 12, cursor: "pointer",
    border: "1px solid", fontFamily: "inherit", transition: "all 0.12s",
    background: activeTab === name ? "rgba(52,211,153,0.08)" : "transparent",
    color: activeTab === name ? "#34d399" : "#6b7280",
    borderColor: activeTab === name ? "rgba(52,211,153,0.3)" : "#1f1f1f",
    fontWeight: activeTab === name ? 600 : 400,
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["departments", "roles", "activity"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
            {t === "departments" && "⊞ "}
            {t === "roles" && "◈ "}
            {t === "activity" && "◷ "}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "departments" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Departments", value: Object.keys(grouped).length },
              { label: "Total Members", value: users.length },
              { label: "Unassigned", value: users.filter(u => u.department === "Unassigned").length },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>
          {Object.entries(grouped).map(([dept, members]) => {
            const dc = DEPT_COLORS[dept] || DEPT_COLORS.Unassigned;
            return (
              <div key={dept} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", gap: 10, background: "#080808" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: dc.text, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>{dept}</span>
                  <span style={{ fontSize: 11, background: dc.bg, color: dc.text, padding: "2px 8px", borderRadius: 20, border: `1px solid ${dc.border}` }}>
                    {members.length} {members.length === 1 ? "member" : "members"}
                  </span>
                </div>
                {members.map((u, idx) => {
                  const pal = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
                  return (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid #111" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: pal.chip, color: pal.dot, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, border: `1px solid ${pal.dot}33` }}>{u.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "#4b5563" }}>{u.profession} · {u.projectGoals}</div>
                      </div>
                      <Chip label={u.status} colors={STATUS_COLORS[u.status]} />
                      <Chip label={u.role} colors={ROLE_COLORS[u.role]} />
                      <select value={u.department} onChange={e => onDeptChange(u.id, e.target.value)}
                        style={{ background: "#111", border: "1px solid #2d2d2d", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#9ca3af", fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "roles" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {ROLES.map(r => {
              const rc = ROLE_COLORS[r];
              const count = users.filter(u => u.role === r).length;
              return (
                <div key={r} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: rc.text, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r}s</span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", lineHeight: 1 }}>{count}</p>
                </div>
              );
            })}
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #141414", background: "#080808", fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>Member roles</div>
            {users.map((u, idx) => {
              const pal = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid #111" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: pal.chip, color: pal.dot, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, border: `1px solid ${pal.dot}33` }}>{u.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#4b5563" }}>{u.profession}</div>
                  </div>
                  <Chip label={u.department} colors={DEPT_COLORS[u.department] || DEPT_COLORS.Unassigned} />
                  <select value={u.role} onChange={e => onRoleChange(u.id, e.target.value)}
                    style={{ background: "#111", border: "1px solid #2d2d2d", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#9ca3af", fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <Chip label={u.role} colors={ROLE_COLORS[u.role]} />
                </div>
              );
            })}
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #141414", background: "#080808", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>Permissions</span>
              <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setPermRole(r)} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                    fontFamily: "inherit", border: "1px solid",
                    background: permRole === r ? ROLE_COLORS[r].bg : "transparent",
                    color: permRole === r ? ROLE_COLORS[r].text : "#6b7280",
                    borderColor: permRole === r ? ROLE_COLORS[r].border : "#1f1f1f",
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {Object.entries(PERMS[permRole]).map(([perm, allowed]) => (
                <div key={perm} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderBottom: "1px solid #111" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: allowed ? "rgba(52,211,153,0.12)" : "rgba(239,68,68,0.08)", border: `1px solid ${allowed ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: allowed ? "#34d399" : "#ef4444" }}>
                    {allowed ? "✓" : "✕"}
                  </span>
                  <span style={{ fontSize: 12, color: allowed ? "#9ca3af" : "#4b5563" }}>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total events", value: feed.length },
              { label: "Role changes", value: feed.filter(f => f.type === "role").length },
              { label: "Dept changes", value: feed.filter(f => f.type === "dept").length },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #141414", background: "#080808", fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>Activity log</div>
            {feed.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#374151", fontSize: 13 }}>No activity yet.</div>}
            {feed.map((item, idx) => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 18px", borderBottom: "1px solid #111" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, paddingTop: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: FEED_DOT[item.type] || "#6b7280", flexShrink: 0, display: "block" }} />
                  {idx < feed.length - 1 && <span style={{ width: 1, height: 24, background: "#1f1f1f", display: "block", marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#e5e7eb" }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>{item.time}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${FEED_DOT[item.type] || "#6b7280"}18`, color: FEED_DOT[item.type] || "#6b7280", border: `1px solid ${FEED_DOT[item.type] || "#6b7280"}33`, textTransform: "capitalize" }}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardPage({ users, search, setSearch, expandedId, setExpandedId, editingId, startEdit, saveEdit, cancelEdit, deleteUser, editDraft, setEditDraft, addOpen, setAddOpen, addDraft, setAddDraft, addUser }) {
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.profession.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    if (editingId === id) return;
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", margin: 0 }}>Client Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Manage and view all members in your organization</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#111", border: "1px solid #1f1f1f", borderRadius: 9, padding: "8px 12px" }}>
            <span style={{ color: "#4b5563", fontSize: 13 }}>⌕</span>
            <input
              style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#e5e7eb", width: 170, fontFamily: "inherit" }}
              placeholder="Search users…"
              value={search}
              onChange={e => { setSearch(e.target.value); setExpandedId(null); }}
            />
          </div>
          <button onClick={() => setAddOpen(o => !o)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: addOpen ? "#1a1a1a" : "#34d399", color: addOpen ? "#e5e7eb" : "#000",
            border: "none", borderRadius: 9, padding: "9px 16px",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}>{addOpen ? "✕ Close" : "+ Add User"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Clients", value: filtered.length, sub: "in your org" },
          { label: "Active Clients", value: users.filter(u => u.status === "Active").length, sub: "currently active" },
          { label: "Completed", value: users.filter(u => u.status === "Complete").length, sub: "projects done" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 18px" }}>
            <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {addOpen && (
        <div style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb", marginBottom: 16, letterSpacing: "-0.01em" }}>＋ New team member</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[
              { key: "name", label: "Full Name" }, { key: "email", label: "Email" },
              { key: "profession", label: "Profession" }, { key: "projectGoals", label: "Project Goals" },
              { key: "phone", label: "Phone" }, { key: "location", label: "Location" },
              { key: "joined", label: "Joined" },
            ].map(f => (
              <Field key={f.key} label={f.label}>
                <input style={inputStyle} type="text" value={addDraft[f.key] || ""}
                  onChange={e => setAddDraft(d => ({ ...d, [f.key]: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "#34d399")}
                  onBlur={e => (e.target.style.borderColor = "#2d2d2d")} />
              </Field>
            ))}
            <Field label="Role">
              <select style={selectStyle} value={addDraft.role} onChange={e => setAddDraft(d => ({ ...d, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Department">
              <select style={selectStyle} value={addDraft.department} onChange={e => setAddDraft(d => ({ ...d, department: e.target.value }))}>
                {DEPARTMENTS.map(dept => <option key={dept}>{dept}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={selectStyle} value={addDraft.status} onChange={e => setAddDraft(d => ({ ...d, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Bio / Resume">
                <textarea style={{ ...inputStyle, minHeight: 56, resize: "vertical", lineHeight: 1.5 }}
                  value={addDraft.resume}
                  onChange={e => setAddDraft(d => ({ ...d, resume: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "#34d399")}
                  onBlur={e => (e.target.style.borderColor = "#2d2d2d")} />
              </Field>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addUser} style={{ background: "#34d399", color: "#000", border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add member</button>
            <button onClick={() => { setAddOpen(false); setAddDraft(EMPTY_FORM); }} style={{ background: "transparent", color: "#6b7280", border: "1px solid #2d2d2d", borderRadius: 7, padding: "9px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
        {/* Table header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 12px 14px 12px", borderBottom: "1px solid #1a1a1a" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb", letterSpacing: "-0.01em" }}>Team members</span>
          <span style={{ fontSize: 11, background: "rgba(52,211,153,0.1)", color: "#34d399", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(52,211,153,0.2)" }}>
            {filtered.length} {filtered.length === 1 ? "user" : "users"}
          </span>
        </div>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr 1.6fr 1fr", padding: "8px 12px", borderBottom: "1px solid #141414", background: "#080808" }}>
          {["Client Name", "Department", "Role", "Project Goals"].map(h => (
            <span key={h} style={{ fontSize: 10, color: "#374151", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#374151", fontSize: 13 }}>No users found.</div>}
        {filtered.map((u, idx) => {
          const pal = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
          const isExpanded = expandedId === u.id;
          const isEditing = editingId === u.id;
          return (
            <div key={u.id} style={{ borderBottom: "1px solid #111" }}>
              <div
                onClick={() => toggleExpand(u.id)}
                style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr 1.6fr 1fr", padding: "13px 12px", cursor: "pointer", background: isExpanded ? "#111" : "transparent", transition: "background 0.12s", alignItems: "center" }}
                onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = "#0f0f0f"; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: pal.chip, color: pal.dot, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, border: `1px solid ${pal.dot}33` }}>{u.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb", lineHeight: 1.2 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>{u.email}</div>
                  </div>
                </div>
                <Chip label={u.department} colors={DEPT_COLORS[u.department] || DEPT_COLORS.Unassigned} />
                <Chip label={u.role} colors={ROLE_COLORS[u.role]} />
                <span style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.projectGoals}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Chip label={u.status} colors={STATUS_COLORS[u.status]} />
                  <span style={{ marginLeft: "auto", fontSize: 14, color: "#374151", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.18s", display: "inline-block" }}>›</span>
                </div>
              </div>
              {isExpanded && !isEditing && (
                <div style={{ padding: "16px 24px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                      { icon: "✉", label: u.email },
                      { icon: "✆", label: u.phone },
                      { icon: "⌖", label: u.location },
                      { icon: "◷", label: `Joined ${u.joined}` },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "8px 11px", fontSize: 12, color: "#6b7280" }}>
                        <span style={{ color: "#374151" }}>{item.icon}</span>{item.label}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6b7280", marginBottom: 14, lineHeight: 1.5, display: "flex", gap: 8 }}>
                    <span style={{ color: "#374151", flexShrink: 0 }}>📄</span>{u.resume}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(u)} style={{ background: "rgba(52,211,153,0.08)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 7, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>✎ Edit</button>
                    <button onClick={() => deleteUser(u.id)} style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>⊗ Delete</button>
                  </div>
                </div>
              )}
              {isExpanded && isEditing && (
                <EditForm
                  data={editDraft}
                  onChange={(k, v) => setEditDraft(d => ({ ...d, [k]: v }))}
                  onSave={saveEdit} onCancel={cancelEdit}
                  onDelete={() => deleteUser(u.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState(EMPTY_FORM);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [navActive, setNavActive] = useState("Dashboard");

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  };

  const logFeed = (type, text) =>
    setFeed(prev => [{ id: Date.now(), type, text, time: "Just now" }, ...prev]);

  const startEdit = (u) => { setEditingId(u.id); setEditDraft({ ...u }); };

  const saveEdit = () => {
    const prev = users.find(u => u.id === editingId);
    setUsers(prev2 => prev2.map(u => u.id === editingId ? { ...u, ...editDraft } : u));
    if (prev && prev.role !== editDraft.role) logFeed("role", `${editDraft.name} role changed to ${editDraft.role}`);
    if (prev && prev.department !== editDraft.department) logFeed("dept", `${editDraft.name} moved to ${editDraft.department}`);
    if (prev && prev.role === editDraft.role && prev.department === editDraft.department) logFeed("edit", `${editDraft.name} profile updated`);
    setEditingId(null);
    showToast("Changes saved");
  };

  const cancelEdit = () => setEditingId(null);

  const deleteUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setExpandedId(null); setEditingId(null);
    if (u) logFeed("del", `${u.name} removed from team`);
    showToast("User removed");
  };

  const addUser = () => {
    if (!addDraft.name.trim()) return;
    setUsers(prev => [...prev, { ...addDraft, id: Date.now() }]);
    logFeed("add", `${addDraft.name} added to team`);
    setAddDraft(EMPTY_FORM); setAddOpen(false);
    showToast("User added");
  };

  const handleRoleChange = (id, role) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.map(x => x.id === id ? { ...x, role } : x));
    if (u) logFeed("role", `${u.name} role changed to ${role}`);
    showToast(`Role updated to ${role}`);
  };

  const handleDeptChange = (id, department) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.map(x => x.id === id ? { ...x, department } : x));
    if (u) logFeed("dept", `${u.name} moved to ${department}`);
    showToast(`Moved to ${department}`);
  };

  const navItems = ["Dashboard", "Team", "Reports"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#080808", color: "#e5e7eb", fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif" }}>
      <aside style={{ width: 210, flexShrink: 0, background: "#0d0d0d", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", padding: "24px 14px", position: "fixed", height: "100vh", top: 0, left: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px", marginBottom: 36 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(52,211,153,0.2)" }}>
            <span style={{ fontSize: 14 }}>⬡</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "#f9fafb" }}>UserHub</span>
        </div>
        <p style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 6px", marginBottom: 6 }}>Navigation</p>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button key={item} onClick={() => setNavActive(item)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
              borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none",
              fontFamily: "inherit", textAlign: "left", transition: "all 0.12s",
              background: navActive === item ? "rgba(52,211,153,0.08)" : "transparent",
              color: navActive === item ? "#34d399" : "#6b7280",
              borderLeft: navActive === item ? "2px solid #34d399" : "2px solid transparent",
            }}>
              {item === "Dashboard" && "▦"}
              {item === "Team" && "◎"}
              {item === "Reports" && "≡"}
              <span style={{ marginLeft: 2 }}>{item}</span>
              {item === "Team" && feed.filter(f => f.time === "Just now").length > 0 && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
              )}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { window.location.href = '/'; }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", background: "transparent", border: "1px solid #1f1f1f", borderRadius: 8, color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s", marginTop: "auto" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#6b7280"; }}
        >⇥ Logout</button>
      </aside>
      <main style={{ marginLeft: 210, flex: 1, padding: "26px 22px 26px 0" }}>
        {navActive === "Dashboard" && (
          <DashboardPage
            users={users} search={search} setSearch={setSearch}
            expandedId={expandedId} setExpandedId={setExpandedId}
            editingId={editingId}
            startEdit={startEdit} saveEdit={saveEdit} cancelEdit={cancelEdit}
            deleteUser={deleteUser} editDraft={editDraft} setEditDraft={setEditDraft}
            addOpen={addOpen} setAddOpen={setAddOpen}
            addDraft={addDraft} setAddDraft={setAddDraft} addUser={addUser}
          />
        )}
        {navActive === "Team" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.02em", margin: 0 }}>Team</h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Manage departments, roles, and permissions</p>
            </div>
            <TeamPage users={users} onRoleChange={handleRoleChange} onDeptChange={handleDeptChange} feed={feed} />
          </>
        )}
        {navActive === "Reports" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, color: "#374151", gap: 10 }}>
            <span style={{ fontSize: 32 }}>≡</span>
            <p style={{ fontSize: 14 }}>Reports coming soon</p>
          </div>
        )}
      </main>
      <Toast msg={toast.msg} visible={toast.visible} />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        html, body { margin: 0; background: #080808; }
        input::placeholder, textarea::placeholder { color: #374151; }
        button:active { opacity: 0.85; }
        select option { background: #111; color: #e5e7eb; }
      `}</style>
    </div>
  );
}