/**
 * utils.js
 * Small, dependency-free helper functions shared across the app.
 */

const Utils = (() => {
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatMoney(amount) {
    const data = Store.get();
    const symbol = data.meta.currency || "৳";
    const n = Number(amount) || 0;
    return `${symbol}${n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function currentMonthKey(dateStr) {
    return (dateStr || todayStr()).slice(0, 7); // 'YYYY-MM'
  }

  function toast(message, type = "info") {
    const wrap = document.getElementById("toastWrap");
    if (!wrap) return alert(message);
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 250);
    }, 3200);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return {
    uid,
    todayStr,
    addDays,
    formatDate,
    formatMoney,
    currentMonthKey,
    toast,
    escapeHtml,
    downloadCsv,
  };
})();
