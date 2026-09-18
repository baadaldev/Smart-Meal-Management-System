/**
 * reports.js
 * Monthly summary stats, two charts (weekly bazar spend, meal-rate
 * breakdown), a full member balance sheet, and a CSV export.
 */

const Reports = (() => {
  let bazarChart = null;
  let rateChart = null;

  function render() {
    const data = Store.get();
    const monthInput = document.getElementById("reportMonth");
    const monthKey = monthInput.value || Utils.currentMonthKey();

    renderStats(data, monthKey);
    renderLedger(data, monthKey);
    renderBazarChart(data);
    renderRateChart(data, monthKey);
  }

  function renderStats(data, monthKey) {
    const meals = Calc.totalMeals(data.meals, monthKey);
    const bazar = Calc.totalBazar(data.bazar, monthKey);
    const deposits = Calc.totalDeposits(data.deposits, monthKey);
    const rate = Calc.mealRate(data.meals, data.bazar, monthKey);

    const stats = [
      { label: "Total meals", value: meals.toFixed(1) },
      { label: "Total bazar spend", value: Utils.formatMoney(bazar) },
      { label: "Total deposits", value: Utils.formatMoney(deposits) },
      { label: "Meal rate (per meal)", value: Utils.formatMoney(rate) },
    ];

    document.getElementById("reportStats").innerHTML = stats
      .map(
        (s) => `
      <div class="stat-tile">
        <div class="label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
      </div>`
      )
      .join("");
  }

  function renderLedger(data, monthKey) {
    let ledger = Calc.memberLedger(data, monthKey);
    if (!App.isAdmin()) {
      const session = App.getSession();
      ledger = ledger.filter((l) => l.member.id === session.memberId);
    }

    const tbody = document.querySelector("#ledgerTable tbody");
    if (!ledger.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No data for this month yet.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = ledger
      .map((l) => {
        const pill =
          l.balance > 0
            ? `<span class="pill pill-green">Advance</span>`
            : l.balance < 0
            ? `<span class="pill pill-red">Due</span>`
            : `<span class="pill pill-amber">Settled</span>`;
        return `
        <tr>
          <td>${Utils.escapeHtml(l.member.name)}</td>
          <td class="num">${l.meals.toFixed(1)}</td>
          <td class="num money">${Utils.formatMoney(l.cost)}</td>
          <td class="num money">${Utils.formatMoney(l.deposits)}</td>
          <td class="num money">${Utils.formatMoney(l.balance)} ${pill}</td>
        </tr>`;
      })
      .join("");
  }

  function renderBazarChart(data) {
    const series = Calc.weeklyBazarSeries(data.bazar, 6);
    const ctx = document.getElementById("bazarChart");
    if (!ctx) return;
    if (bazarChart) bazarChart.destroy();
    bazarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: series.map((s) => s.label),
        datasets: [
          {
            label: "Bazar spend",
            data: series.map((s) => s.total),
            backgroundColor: "rgba(37,99,235,0.55)",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#93a1bd", font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { color: "#93a1bd" }, grid: { color: "rgba(255,255,255,0.04)" }, beginAtZero: true },
        },
      },
    });
  }

  function renderRateChart(data, monthKey) {
    const ctx = document.getElementById("rateChart");
    if (!ctx) return;
    const ledger = Calc.memberLedger(data, monthKey);
    if (rateChart) rateChart.destroy();
    rateChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ledger.map((l) => l.member.name),
        datasets: [
          {
            data: ledger.map((l) => l.meals),
            backgroundColor: ["#7c3aed", "#2563eb", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"],
            borderColor: "#10192e",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#93a1bd", boxWidth: 10, font: { size: 11 } } },
        },
      },
    });
  }

  function setupControls() {
    const monthInput = document.getElementById("reportMonth");
    if (monthInput) monthInput.addEventListener("change", render);

    const exportBtn = document.getElementById("exportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const data = Store.get();
        const monthKey = monthInput.value || Utils.currentMonthKey();
        const ledger = Calc.memberLedger(data, monthKey);
        const rows = [["Member", "Meals", "Cost Owed", "Deposited", "Balance"]];
        ledger.forEach((l) => rows.push([l.member.name, l.meals, l.cost.toFixed(2), l.deposits.toFixed(2), l.balance.toFixed(2)]));
        Utils.downloadCsv(`meal-report-${monthKey}.csv`, rows);
        Utils.toast("Report exported.", "success");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", setupControls);

  return { render };
})();
