/**
 * meals.js
 * Manager sets each member's meal count for a chosen date via a quick-entry
 * grid. Everyone can see the meal history table (members see only their own).
 */

const Meals = (() => {
  function render() {
    renderEntryGrid();
    renderHistory();
  }

  function renderEntryGrid() {
    const tbody = document.querySelector("#mealEntryTable tbody");
    if (!tbody || !App.isAdmin()) return;

    const data = Store.get();
    const dateInput = document.getElementById("mealDate");
    const date = dateInput.value || Utils.todayStr();

    if (!data.members.length) {
      tbody.innerHTML = `<tr><td colspan="2"><div class="empty-state">Add members first.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = data.members
      .map((m) => {
        const existing = data.meals.find((meal) => meal.memberId === m.id && meal.date === date);
        const val = existing ? existing.count : 1;
        return `
        <tr>
          <td>${Utils.escapeHtml(m.name)}</td>
          <td class="num">
            <input type="number" step="0.5" min="0" max="5" style="width:90px; text-align:right;"
              data-member="${m.id}" value="${val}" />
          </td>
        </tr>`;
      })
      .join("");
  }

  function setupSaveButton() {
    const btn = document.getElementById("saveMealsBtn");
    const dateInput = document.getElementById("mealDate");
    if (!btn) return;

    dateInput.addEventListener("change", renderEntryGrid);

    btn.addEventListener("click", () => {
      const data = Store.get();
      const date = dateInput.value || Utils.todayStr();
      const inputs = document.querySelectorAll("#mealEntryTable [data-member]");

      inputs.forEach((input) => {
        const memberId = input.dataset.member;
        const count = parseFloat(input.value) || 0;
        const existing = data.meals.find((m) => m.memberId === memberId && m.date === date);
        if (existing) {
          Store.update("meals", existing.id, { count });
        } else {
          Store.insert("meals", { memberId, date, count });
        }
      });

      Utils.toast(`Meal counts saved for ${Utils.formatDate(date)}.`, "success");
      App.refreshAll();
    });
  }

  function renderHistory() {
    const data = Store.get();
    const tbody = document.querySelector("#mealHistoryTable tbody");
    let rows = [...data.meals].sort((a, b) => (a.date < b.date ? 1 : -1));

    if (!App.isAdmin()) {
      const session = App.getSession();
      rows = rows.filter((r) => r.memberId === session.memberId);
    }

    rows = rows.slice(0, 60);

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="3"><div class="empty-state">No meal entries yet.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((r) => {
        const member = data.members.find((m) => m.id === r.memberId);
        return `
        <tr>
          <td>${Utils.formatDate(r.date)}</td>
          <td>${Utils.escapeHtml(member ? member.name : "Unknown")}</td>
          <td class="num">${r.count}</td>
        </tr>`;
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", setupSaveButton);

  return { render };
})();
