// app.js - Local Sports & Indoor Games Partner Finder (static mock UI)
// No backend: this simulates flows in-memory.

const state = {
    currentUserId: null,
    users: [
        {
            id: "u1",
            name: "Asha",
            city: "Indore",
            area: "Vijay Nagar",
            games: ["Badminton", "Table Tennis"],
            indoorOutdoor: ["Indoor"],
            skillLevel: "intermediate",
            availability: { days: ["Mon", "Wed", "Sat"], time: "6:00 PM - 8:00 PM" },
            locationType: "Society clubhouse",
        },
        {
            id: "u2",
            name: "Neha",
            city: "Indore",
            area: "Vijay Nagar",
            games: ["Chess", "Carrom"],
            indoorOutdoor: ["Indoor", "Outdoor"],
            skillLevel: "beginner",
            availability: { days: ["Tue", "Thu"], time: "7:00 PM - 9:00 PM" },
            locationType: "Home",
        },
        {
            id: "u3",
            name: "Riya",
            city: "Indore",
            area: "Rajwada",
            games: ["Badminton"],
            indoorOutdoor: ["Outdoor"],
            skillLevel: "advanced",
            availability: { days: ["Mon", "Thu", "Fri"], time: "5:30 PM - 7:30 PM" },
            locationType: "Local ground",
        },
    ],
    matchRequests: [], // {id, fromUserId, toUserId, game, locationType, status, createdAt}
};

function $(sel) {
    return document.querySelector(sel);
}
function $all(sel) {
    return Array.from(document.querySelectorAll(sel));
}

function setActiveSection(sectionId) {
    const sections = $all("[data-section]");
    sections.forEach((s) => {
        const isActive = s.getAttribute("data-section") === sectionId;
        s.classList.toggle("hidden", !isActive);
    });

    const buttons = $all("[data-tab-btn]");
    buttons.forEach((b) => {
        const isActive = b.getAttribute("data-tab-btn") === sectionId;
        b.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

function showToast(msg, kind = "neutral") {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast";
    if (kind === "success") el.style.borderColor = "rgba(52,211,153,.45)";
    if (kind === "danger") el.style.borderColor = "rgba(251,113,133,.45)";
    if (kind === "warn") el.style.borderColor = "rgba(110,231,255,.45)";
    el.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.add("hidden"), 2800);
}

function getSkillPill(skill) {
    const s = (skill || "").toLowerCase();
    if (s === "beginner") return { cls: "pill good", label: "Beginner" };
    if (s === "intermediate") return { cls: "pill warn", label: "Intermediate" };
    if (s === "advanced") return { cls: "pill bad", label: "Advanced" };
    return { cls: "pill", label: skill || "—" };
}

function renderProfileSummary(user) {
    $("#profileName").textContent = user ? user.name : "—";
    $("#profileCity").textContent = user ? `${user.city} • ${user.area}` : "—";
    $("#profileGames").textContent = user ? user.games.join(", ") : "—";
    $("#profileSkill").textContent = user ? user.skillLevel : "—";
    $("#profileAvailability").textContent = user
        ? `${user.availability.time} (${user.availability.days.join(", ")})`
        : "—";
    $("#profileLocationType").textContent = user ? user.locationType : "—";
}

function renderRequests() {
    const me = state.currentUserId;
    const incoming = state.matchRequests.filter((r) => r.toUserId === me);
    const outgoing = state.matchRequests.filter((r) => r.fromUserId === me);

    const incTbody = $("#incomingRequestsTbody");
    const outTbody = $("#outgoingRequestsTbody");
    incTbody.innerHTML = "";
    outTbody.innerHTML = "";

    function statusPill(status) {
        const s = (status || "").toLowerCase();
        if (s === "accepted") return '<span class="pill good">Accepted</span>';
        if (s === "declined") return '<span class="pill bad">Declined</span>';
        return '<span class="pill warn">Pending</span>';
    }

    for (const r of incoming) {
        const from = state.users.find((u) => u.id === r.fromUserId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${from ? from.name : r.fromUserId}</td>
      <td>${r.game}</td>
      <td>${r.locationType}</td>
      <td>${statusPill(r.status)}</td>
      <td>
        <div class="actions">
          <button class="btn primary" data-accept-request="${r.id}">Accept</button>
          <button class="btn danger" data-decline-request="${r.id}">Decline</button>
        </div>
      </td>
    `;
        incTbody.appendChild(tr);
    }

    for (const r of outgoing) {
        const to = state.users.find((u) => u.id === r.toUserId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${to ? to.name : r.toUserId}</td>
      <td>${r.game}</td>
      <td>${r.locationType}</td>
      <td>${statusPill(r.status)}</td>
      <td>—</td>
    `;
        outTbody.appendChild(tr);
    }

    incTbody.querySelectorAll("[data-accept-request]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-accept-request");
            const req = state.matchRequests.find((x) => x.id === id);
            if (!req) return;
            req.status = "accepted";
            showToast("Play request accepted!", "success");
            renderRequests();
            renderHistory();
        });
    });

    incTbody.querySelectorAll("[data-decline-request]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-decline-request");
            const req = state.matchRequests.find((x) => x.id === id);
            if (!req) return;
            req.status = "declined";
            showToast("Play request declined.", "warn");
            renderRequests();
            renderHistory();
        });
    });
}

function renderHistory() {
    const me = state.currentUserId;
    const hist = state.matchRequests
        .filter((r) => r.fromUserId === me || r.toUserId === me)
        .slice()
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const tbody = $("#historyTbody");
    tbody.innerHTML = "";

    if (hist.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="5" style="color:rgba(255,255,255,.65)">No matches yet. Search nearby players to start.</td>`;
        tbody.appendChild(tr);
        return;
    }

    for (const r of hist) {
        const otherId = r.fromUserId === me ? r.toUserId : r.fromUserId;
        const other = state.users.find((u) => u.id === otherId);

        const statusLabel = (r.status || "").toLowerCase();
        const status =
            statusLabel === "accepted"
                ? '<span class="pill good">Confirmed</span>'
                : statusLabel === "declined"
                    ? '<span class="pill bad">Declined</span>'
                    : '<span class="pill warn">Pending</span>';

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${other ? other.name : otherId}</td>
      <td>${r.game}</td>
      <td>${r.locationType}</td>
      <td>${status}</td>
      <td>${new Date(r.createdAt).toLocaleString()}</td>
    `;
        tbody.appendChild(tr);
    }
}

function renderSearchResults(results) {
    const tbody = $("#resultsTbody");
    tbody.innerHTML = "";

    if (results.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="6" style="color:rgba(255,255,255,.65)">No nearby matches found. Try changing game/location/availability.</td>`;
        tbody.appendChild(tr);
        return;
    }

    for (const u of results) {
        const pill = getSkillPill(u.skillLevel);

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.games.slice(0, 2).join(", ")}${u.games.length > 2 ? "…" : ""}</td>
      <td><span class="${pill.cls}">${pill.label}</span></td>
      <td>${u.availability.time}</td>
      <td>${u.locationType}</td>
      <td>
        <div class="actions">
          <button class="btn primary" data-send-request="${u.id}">Send Request</button>
        </div>
      </td>
    `;
        tbody.appendChild(tr);
    }

    tbody.querySelectorAll("[data-send-request]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const toUserId = btn.getAttribute("data-send-request");
            const me = state.currentUserId;
            if (!me) {
                showToast("Please register/login first.", "warn");
                setActiveSection("login");
                return;
            }

            const game = $("#searchGameType").value;
            const locationType = $("#searchLocationType").value;
            const req = {
                id: "r_" + Math.random().toString(16).slice(2),
                fromUserId: me,
                toUserId,
                game,
                locationType: locationType || "Home",
                status: "pending",
                createdAt: Date.now(),
            };
            state.matchRequests.push(req);
            showToast("Play request sent!", "success");
            renderRequests();
            renderHistory();
            setActiveSection("requests");
        });
    });
}

function search() {
    const me = state.currentUserId;
    const game = ($("#searchGameType").value || "").trim();
    const area = ($("#searchArea").value || "").trim().toLowerCase();
    const locationType = ($("#searchLocationType").value || "").trim();

    const results = state.users
        .filter((u) => u.id !== me)
        .filter((u) => !game || u.games.includes(game))
        .filter((u) => !area || u.area.toLowerCase().includes(area))
        .filter((u) => !locationType || u.locationType === locationType)
        .slice(0, 6);

    renderSearchResults(results);
}

function wireNavigation() {
    $all("[data-tab-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const sectionId = btn.getAttribute("data-tab-btn");
            setActiveSection(sectionId);

            // Gate auth-dependent sections
            if (
                [
                    "profile",
                    "search",
                    "requests",
                    "history",
                    "admin",
                    "community",
                    "pandit",
                ].includes(sectionId) &&
                !state.currentUserId
            ) {
                showToast("Please login/register first.", "warn");
                setActiveSection("login");
            }

            if (sectionId === "search") search();
            if (sectionId === "requests") renderRequests();
            if (sectionId === "history") renderHistory();
            if (sectionId === "profile")
                renderProfileSummary(
                    state.users.find((u) => u.id === state.currentUserId),
                );
        });
    });
}

function wireForms() {
    // Login/Register mock
    $("#loginForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = ($("#loginName").value || "").trim();
        const city = ($("#loginCity").value || "").trim() || "Indore";
        const area = ($("#loginArea").value || "").trim() || "Vijay Nagar";

        if (!name) return showToast("Name is required.", "danger");

        // If name matches an existing mock user, login as that user; otherwise create.
        let user = state.users.find(
            (u) => u.name.toLowerCase() === name.toLowerCase(),
        );
        if (!user) {
            user = {
                id: "u_" + Math.random().toString(16).slice(2),
                name,
                city,
                area,
                games: ["Chess"],
                indoorOutdoor: ["Indoor"],
                skillLevel: "beginner",
                availability: { days: ["Sat"], time: "6:00 PM - 8:00 PM" },
                locationType: "Home",
            };
            state.users.push(user);
        } else {
            user.city = city;
            user.area = area;
        }

        state.currentUserId = user.id;
        showToast("Logged in successfully!", "success");
        renderProfileSummary(user);
        setActiveSection("profile");
    });

    // Profile save
    $("#profileForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const me = state.users.find((u) => u.id === state.currentUserId);
        if (!me) return;

        const games = $all('[name="games"]:checked').map((x) => x.value);
        const indoorOutdoor = $all('[name="indoorOutdoor"]:checked').map(
            (x) => x.value,
        );
        const skillLevel = ($("#skillLevel").value || "beginner").toLowerCase();
        const locationType = $("#locationType").value || "Home";

        const dayOptions = $all('[name="days"]:checked').map((x) => x.value);
        const time = ($("#timeSlot").value || "").trim();

        if (games.length === 0)
            return showToast("Select at least one game.", "danger");
        if (dayOptions.length === 0)
            return showToast("Select at least one day.", "danger");
        if (!time) return showToast("Time slot is required.", "danger");

        me.games = games;
        me.indoorOutdoor = indoorOutdoor.length ? indoorOutdoor : ["Indoor"];
        me.skillLevel = skillLevel;
        me.locationType = locationType;
        me.availability = { days: dayOptions, time };

        showToast("Profile saved.", "success");
        renderProfileSummary(me);
    });

    // Search form
    $("#searchForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        search();
        setActiveSection("search");
    });
}

function init() {
    // default tab
    setActiveSection("home");
    wireNavigation();
    wireForms();

    // default data loads (if login exists)
    if (state.currentUserId) {
        renderProfileSummary(state.users.find((u) => u.id === state.currentUserId));
        renderRequests();
        renderHistory();
    }
}

init();
