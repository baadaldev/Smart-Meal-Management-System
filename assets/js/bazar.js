/**
 * bazar.js
 * Manager records grocery/market spending. Everyone can view the list.
 */

const Bazar = (() => {
  function render() {
    const data = Store.get();
    const tbody = document.querySelector("#bazarTable tbody");
    const rows = [...data.bazar].sort((a, b) => (a.date < b.date ? 1 : -1));

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No bazar expenses recorded yet.</div></td></tr>`;
    } else {
      tbody.innerHTML = rows
        .map((b) => {
          const buyer = data.members.find((m) => m.id === b.buyerId);
          return `
          <tr>
            <td>${Utils.formatDate(b.date)}</td>
            <td>${Utils.escapeHtml(b.item)}${b.note ? ` <span style="color:var(--text-muted)">— ${Utils.escapeHtml(b.note)}</span>` : ""}</td>
            <td>${Utils.escapeHtml(buyer ? buyer.name : "—")}</td>
            <td class="num money">${Utils.formatMoney(b.amount)}</td>
            <td class="num">${App.isAdmin() ? `<button class="icon-btn" data-remove="${b.id}" title="Delete">✕</button>` : ""}</td>
          </tr>`;
        })
        .join("");
    }

    tbody.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.remove("bazar", btn.dataset.remove);
        Utils.toast("Bazar entry removed.", "success");
        App.refreshAll();
      });
    });

    const total = Calc.totalBazar(data.bazar);
    document.getElementById("bazarTotalPill").textContent = `Total: ${Utils.formatMoney(total)}`;
  }

  function setupForm() {
    const form = document.getElementById("bazarForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = document.getElementById("bDate").value || Utils.todayStr();
      const item = document.getElementById("bItem").value.trim();
      const amount = parseFloat(document.getElementById("bAmount").value) || 0;
      const buyerId = document.getElementById("bBuyer").value;
      const note = document.getElementById("bNote").value.trim();
      if (!item || amount <= 0) return;

      Store.insert("bazar", { date, item, amount, buyerId, note });
      form.reset();
      document.getElementById("bDate").value = Utils.todayStr();
      Utils.toast("Bazar expense added.", "success");
      App.refreshAll();
    });
  }

  document.addEventListener("DOMContentLoaded", setupForm);

  return { render };
})();
