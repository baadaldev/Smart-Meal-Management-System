/**
 * deposits.js
 * Manager records money each member pays in. Members see only their own.
 */

const Deposits = (() => {
  function render() {
    const data = Store.get();
    const tbody = document.querySelector("#depositsTable tbody");
    let rows = [...data.deposits].sort((a, b) => (a.date < b.date ? 1 : -1));

    if (!App.isAdmin()) {
      const session = App.getSession();
      rows = rows.filter((r) => r.memberId === session.memberId);
    }

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No deposits recorded yet.</div></td></tr>`;
    } else {
      tbody.innerHTML = rows
        .map((d) => {
          const member = data.members.find((m) => m.id === d.memberId);
          return `
          <tr>
            <td>${Utils.formatDate(d.date)}</td>
            <td>${Utils.escapeHtml(member ? member.name : "Unknown")}</td>
            <td>${Utils.escapeHtml(d.note || "—")}</td>
            <td class="num money">${Utils.formatMoney(d.amount)}</td>
            <td class="num">${App.isAdmin() ? `<button class="icon-btn" data-remove="${d.id}" title="Delete">✕</button>` : ""}</td>
          </tr>`;
        })
        .join("");
    }

    tbody.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.remove("deposits", btn.dataset.remove);
        Utils.toast("Deposit removed.", "success");
        App.refreshAll();
      });
    });

    const totalRows = App.isAdmin() ? data.deposits : rows;
    const total = totalRows.reduce((s, d) => s + Number(d.amount), 0);
    document.getElementById("depositTotalPill").textContent = `Total: ${Utils.formatMoney(total)}`;
  }

  function setupForm() {
    const form = document.getElementById("depositForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const memberId = document.getElementById("dMember").value;
      const date = document.getElementById("dDate").value || Utils.todayStr();
      const amount = parseFloat(document.getElementById("dAmount").value) || 0;
      const note = document.getElementById("dNote").value.trim();
      if (!memberId || amount <= 0) return;

      Store.insert("deposits", { memberId, date, amount, note });
      form.reset();
      document.getElementById("dDate").value = Utils.todayStr();
      Utils.toast("Deposit recorded.", "success");
      App.refreshAll();
    });
  }

  document.addEventListener("DOMContentLoaded", setupForm);

  return { render };
})();
