/**
 * members.js
 * Manager can add / edit / delete mess members. Members see a read-only list.
 */

const Members = (() => {
  function render() {
    const data = Store.get();
    const tbody = document.querySelector("#membersTable tbody");

    if (!data.members.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No members yet. Add your first member above.</div></td></tr>`;
    } else {
      tbody.innerHTML = data.members
        .map(
          (m) => `
        <tr>
          <td>${Utils.escapeHtml(m.name)}</td>
          <td>${Utils.escapeHtml(m.room)}</td>
          <td>${Utils.escapeHtml(m.phone || "—")}</td>
          <td>${Utils.formatDate(m.joinedDate)}</td>
          <td class="num">
            ${
              App.isAdmin()
                ? `<button class="icon-btn" data-remove="${m.id}" title="Remove member">✕</button>`
                : ""
            }
          </td>
        </tr>`
        )
        .join("");
    }

    tbody.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Remove this member? Their meal, bazar, and deposit history will stay in the records.")) {
          Store.remove("members", btn.dataset.remove);
          Utils.toast("Member removed.", "success");
          App.refreshAll();
        }
      });
    });

    populateMemberDropdowns(data);
  }

  function populateMemberDropdowns(data) {
    const options = data.members.map((m) => `<option value="${m.id}">${Utils.escapeHtml(m.name)}</option>`).join("");
    ["bBuyer", "dMember"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = options || `<option value="">No members yet</option>`;
    });
  }

  function setupForm() {
    const form = document.getElementById("memberForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("mName").value.trim();
      const room = document.getElementById("mRoom").value.trim();
      const phone = document.getElementById("mPhone").value.trim();
      const joinedDate = document.getElementById("mJoined").value || Utils.todayStr();
      if (!name || !room) return;

      Store.insert("members", { name, room, phone, joinedDate });
      form.reset();
      Utils.toast(`${name} added to the mess.`, "success");
      App.refreshAll();
    });
  }

  document.addEventListener("DOMContentLoaded", setupForm);

  return { render };
})();
