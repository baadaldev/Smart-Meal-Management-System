/**
 * auth.js
 * Handles the login page: tab switching between Manager/Member, populating
 * the member dropdown from saved data, and writing a session object that
 * dashboard.html reads on load.
 */

(function () {
  Store.init(); // make sure demo data exists on first visit

  const tabAdminBtn = document.getElementById("tabAdminBtn");
  const tabMemberBtn = document.getElementById("tabMemberBtn");
  const adminTab = document.getElementById("adminTab");
  const memberTab = document.getElementById("memberTab");

  tabAdminBtn.addEventListener("click", () => {
    tabAdminBtn.classList.add("active");
    tabMemberBtn.classList.remove("active");
    adminTab.style.display = "block";
    memberTab.style.display = "none";
  });

  tabMemberBtn.addEventListener("click", () => {
    tabMemberBtn.classList.add("active");
    tabAdminBtn.classList.remove("active");
    memberTab.style.display = "block";
    adminTab.style.display = "none";
  });

  // Populate member dropdown
  const memberSelect = document.getElementById("memberSelect");
  const data = Store.get();
  memberSelect.innerHTML = data.members
    .map((m) => `<option value="${m.id}">${Utils.escapeHtml(m.name)} — Room ${Utils.escapeHtml(m.room)}</option>`)
    .join("");

  function setSession(session) {
    localStorage.setItem("smms_session", JSON.stringify(session));
  }

  document.getElementById("adminForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("adminPass").value;
    if (pass !== "admin123") {
      Utils.toast("Incorrect manager password.", "error");
      return;
    }
    setSession({ role: "admin", memberId: null });
    window.location.href = "dashboard.html";
  });

  document.getElementById("memberForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const memberId = memberSelect.value;
    if (!memberId) return;
    setSession({ role: "member", memberId });
    window.location.href = "dashboard.html";
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    if (confirm("This will erase all data and restore the original demo data. Continue?")) {
      Store.reset();
      window.location.reload();
    }
  });
})();
