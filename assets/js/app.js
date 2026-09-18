/**
 * app.js
 * Boots the dashboard: verifies the session, wires up sidebar navigation,
 * applies role-based visibility, and renders the Overview section.
 * Section-specific rendering (Members, Meals, Bazar, Deposits, Reports,
 * Notices) lives in its own file and is called from here via `App.refreshAll()`.
 */

const App = (() => {
  let session = null;
  let mealsChart = null;

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("smms_session"));
    } catch {
      return null;
    }
  }

  function currentMember(data) {
    if (!session || session.role !== "member") return null;
    return data.members.find((m) => m.id === session.memberId) || null;
  }

  function isAdmin() {
    return session && session.role === "admin";
  }

  // ---------------------------------------------------------------- init
  function init() {
    session = getSession();
    if (!session) {
      window.location.href = "index.html";
      return;
    }

    Store.init();
    document.getElementById("todayLabel").textContent = Utils.formatDate(Utils.todayStr());

    setupUserChip();
    setupNav();
    setupLogout();
    applyRoleVisibility();

    // Default date inputs to today
    ["mealDate", "bDate", "dDate"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = Utils.todayStr();
    });
    const reportMonth = document.getElementById("reportMonth");
    if (reportMonth) reportMonth.value = Utils.currentMonthKey();

    refreshAll();
  }

  function setupUserChip() {
    const data = Store.get();
    const name = isAdmin() ? "Mess Manager" : currentMember(data)?.name || "Member";
    const initials = name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    document.getElementById("userAvatar").textContent = initials;
    document.getElementById("userName").textContent = name;
    document.getElementById("userRole").textContent = isAdmin() ? "manager" : "member";
  }

  function setupLogout() {
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("smms_session");
      window.location.href = "index.html";
    });
  }

  function setupNav() {
    const items = document.querySelectorAll(".nav-item");
    items.forEach((btn) => {
      btn.addEventListener("click", () => showSection(btn.dataset.section));
    });
    showSection("overview");

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle) {
      menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }
  }

  const titles = {
    overview: ["Overview", "A quick snapshot of the whole mess."],
    members: ["Members", "Everyone currently sharing the mess."],
    meals: ["Meals", "Set and review daily meal counts."],
    bazar: ["Bazar", "Grocery and market expenses."],
    deposits: ["Deposits", "Money paid in by each member."],
    reports: ["Reports", "Monthly totals and who owes what."],
    notices: ["Notices", "Announcements for everyone in the mess."],
  };

  function showSection(name) {
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    document.getElementById(`section-${name}`)?.classList.add("active");
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.section === name));

    const [title, sub] = titles[name] || ["", ""];
    document.getElementById("pageTitle").textContent = title;
    document.getElementById("pageSub").innerHTML = `${sub}`;

    document.getElementById("sidebar").classList.remove("open");
  }

  /** Hide manager-only controls when a member is logged in. */
  function applyRoleVisibility() {
    if (isAdmin()) return;
    const hideIds = ["memberFormPanel", "mealEntryPanel", "bazarFormPanel", "depositFormPanel", "noticeFormPanel"];
    hideIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    document.getElementById("mealHistoryTitle").textContent = "My meal history";
    document.getElementById("depositHistoryTitle").textContent = "My deposits";
  }

  // ------------------------------------------------------------ overview
  function renderOverview() {
    const data = Store.get();
    const monthKey = Utils.currentMonthKey();
    const ledger = Calc.memberLedger(data, monthKey);
    const rate = Calc.mealRate(data.meals, data.bazar, monthKey);

    let stats;
    if (isAdmin()) {
      stats = [
        { label: "Total members", value: data.members.length },
        { label: "Meals this month", value: Calc.totalMeals(data.meals, monthKey).toFixed(1) },
        { label: "Bazar spend this month", value: Utils.formatMoney(Calc.totalBazar(data.bazar, monthKey)) },
        { label: "Meal rate", value: Utils.formatMoney(rate) },
      ];
    } else {
      const mine = ledger.find((l) => l.member.id === session.memberId);
      stats = [
        { label: "My meals this month", value: mine ? mine.meals.toFixed(1) : "0" },
        { label: "My cost owed", value: Utils.formatMoney(mine ? mine.cost : 0) },
        { label: "My deposits", value: Utils.formatMoney(mine ? mine.deposits : 0) },
        {
          label: "My balance",
          value: Utils.formatMoney(mine ? mine.balance : 0),
          negative: mine ? mine.balance < 0 : false,
        },
      ];
    }

    document.getElementById("overviewStats").innerHTML = stats
      .map(
        (s) => `
      <div class="stat-tile">
        <div class="label">${s.label}</div>
        <div class="stat-value" style="${s.negative ? "color:var(--red)" : ""}">${s.value}</div>
      </div>`
      )
      .join("");

    renderMealsChart(data);
    renderOverviewNotices(data);
  }

  function renderMealsChart(data) {
    const series = Calc.dailyMealSeries(data.meals, 14);
    const ctx = document.getElementById("mealsChart");
    if (!ctx) return;
    if (mealsChart) mealsChart.destroy();
    mealsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: series.map((s) => s.date.slice(5)),
        datasets: [
          {
            label: "Meals",
            data: series.map((s) => s.total),
            borderColor: "#06b6d4",
            backgroundColor: "rgba(124,58,237,0.18)",
            tension: 0.35,
            fill: true,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#93a1bd", font: { size: 10 } }, grid: { color: "rgba(255,255,255,0.04)" } },
          y: { ticks: { color: "#93a1bd" }, grid: { color: "rgba(255,255,255,0.04)" }, beginAtZero: true },
        },
      },
    });
  }

  function renderOverviewNotices(data) {
    const list = [...data.notices].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
    const wrap = document.getElementById("overviewNotices");
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-state">No notices yet.</div>`;
      return;
    }
    wrap.innerHTML = list
      .map(
        (n) => `
      <div class="notice-card">
        <div class="date">${Utils.formatDate(n.date)}</div>
        <h4>${Utils.escapeHtml(n.title)}</h4>
        <p>${Utils.escapeHtml(n.message)}</p>
      </div>`
      )
      .join("");
  }

  /** Called by every module after it mutates data, so all views stay in sync. */
  function refreshAll() {
    renderOverview();
    Members.render();
    Meals.render();
    Bazar.render();
    Deposits.render();
    Reports.render();
    Notices.render();
  }

  return { init, getSession: () => session, isAdmin, currentMember, showSection, refreshAll };
})();

document.addEventListener("DOMContentLoaded", App.init);
