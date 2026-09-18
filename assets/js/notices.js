/**
 * notices.js
 * Manager posts announcements; everyone in the mess can read them.
 */

const Notices = (() => {
  function render() {
    const data = Store.get();
    const list = [...data.notices].sort((a, b) => (a.date < b.date ? 1 : -1));
    const wrap = document.getElementById("noticesList");

    if (!list.length) {
      wrap.innerHTML = `<div class="empty-state">No notices posted yet.</div>`;
      return;
    }

    wrap.innerHTML = list
      .map(
        (n) => `
      <div class="notice-card">
        <div class="date">${Utils.formatDate(n.date)}</div>
        <h4>${Utils.escapeHtml(n.title)}</h4>
        <p>${Utils.escapeHtml(n.message)}</p>
        ${App.isAdmin() ? `<button class="icon-btn" data-remove="${n.id}" style="margin-top:8px;" title="Delete">✕</button>` : ""}
      </div>`
      )
      .join("");

    wrap.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.remove("notices", btn.dataset.remove);
        Utils.toast("Notice removed.", "success");
        App.refreshAll();
      });
    });
  }

  function setupForm() {
    const form = document.getElementById("noticeForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("nTitle").value.trim();
      const message = document.getElementById("nMessage").value.trim();
      if (!title || !message) return;

      Store.insert("notices", { date: Utils.todayStr(), title, message });
      form.reset();
      Utils.toast("Notice posted.", "success");
      App.refreshAll();
    });
  }

  document.addEventListener("DOMContentLoaded", setupForm);

  return { render };
})();
