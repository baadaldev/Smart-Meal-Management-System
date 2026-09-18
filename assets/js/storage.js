/**
 * storage.js
 * -----------------------------------------------------------------------
 * Data-access layer for the Smart Meal Management System.
 *
 * There is no backend server in this version of the project — all data
 * lives in the browser's localStorage under a single JSON blob. This
 * keeps the project runnable by simply opening index.html (or hosting
 * it on GitHub Pages) with zero build step and zero server.
 *
 * If you extend this project with a real backend (Node/Express + a SQL
 * database is a natural next step), this is the only file that needs to
 * change — every other module talks to `Store`, never to localStorage
 * directly.
 * -----------------------------------------------------------------------
 */

const Store = (() => {
  const KEY = "smms_v1_data";

  /** Shape of a brand-new, empty database. */
  function emptyData() {
    return {
      meta: {
        messName: "Green Valley Hostel Mess",
        currency: "৳",
        createdAt: new Date().toISOString(),
      },
      members: [],   // { id, name, room, phone, joinedDate }
      meals: [],     // { id, memberId, date: 'YYYY-MM-DD', count: 0|0.5|1|1.5|2|3 }
      bazar: [],     // { id, date, item, amount, buyerId, note }
      deposits: [],  // { id, memberId, date, amount, note }
      notices: [],   // { id, date, title, message }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("Store.load failed, resetting data:", err);
      return null;
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }

  function reset() {
    const fresh = emptyData();
    save(fresh);
    return fresh;
  }

  /** Ensures a database exists; seeds demo data on first run. */
  function init() {
    let data = load();
    if (!data) {
      data = seedDemoData();
      save(data);
    }
    return data;
  }

  function get() {
    return load() || init();
  }

  // ---------------------------------------------------------------------
  // Generic collection helpers (members / meals / bazar / deposits / notices)
  // ---------------------------------------------------------------------
  function insert(collection, record) {
    const data = get();
    record.id = Utils.uid();
    data[collection].push(record);
    save(data);
    return record;
  }

  function update(collection, id, patch) {
    const data = get();
    const idx = data[collection].findIndex((r) => r.id === id);
    if (idx === -1) return null;
    data[collection][idx] = { ...data[collection][idx], ...patch };
    save(data);
    return data[collection][idx];
  }

  function remove(collection, id) {
    const data = get();
    data[collection] = data[collection].filter((r) => r.id !== id);
    save(data);
  }

  // ---------------------------------------------------------------------
  // Demo seed data — makes the app feel alive the first time it's opened.
  // ---------------------------------------------------------------------
  function seedDemoData() {
    const data = emptyData();
    const names = [
      { name: "Md Rakibul Islam", room: "A-204", phone: "01700-000001" },
      { name: "Tanvir Ahmed", room: "A-204", phone: "01700-000002" },
      { name: "Shakil Hasan", room: "B-101", phone: "01700-000003" },
      { name: "Nayeem Khan", room: "B-101", phone: "01700-000004" },
      { name: "Rafiul Haque", room: "C-310", phone: "01700-000005" },
    ];

    data.members = names.map((n, i) => ({
      id: `m${i + 1}`,
      name: n.name,
      room: n.room,
      phone: n.phone,
      joinedDate: "2026-06-01",
    }));

    // Generate 21 days of meal history for every member.
    const today = new Date();
    for (let d = 20; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dateStr = date.toISOString().slice(0, 10);
      data.members.forEach((m) => {
        const options = [1, 1, 1.5, 2, 2, 0, 1];
        const count = options[Math.floor(Math.random() * options.length)];
        data.meals.push({
          id: Utils.uid(),
          memberId: m.id,
          date: dateStr,
          count,
        });
      });
    }

    // A few bazar (grocery) entries.
    const bazarItems = [
      { item: "Rice (25kg)", amount: 1650 },
      { item: "Vegetables & fish", amount: 1240 },
      { item: "Chicken (5kg)", amount: 950 },
      { item: "Cooking oil & spices", amount: 780 },
      { item: "Vegetables & eggs", amount: 690 },
      { item: "Beef (4kg)", amount: 1400 },
    ];
    bazarItems.forEach((b, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 3);
      data.bazar.push({
        id: Utils.uid(),
        date: date.toISOString().slice(0, 10),
        item: b.item,
        amount: b.amount,
        buyerId: data.members[i % data.members.length].id,
        note: "",
      });
    });

    // Deposits from each member.
    data.members.forEach((m, i) => {
      data.deposits.push({
        id: Utils.uid(),
        memberId: m.id,
        date: "2026-09-01",
        amount: 2000 + i * 100,
        note: "Monthly advance",
      });
    });

    // A couple of notices.
    data.notices.push(
      {
        id: Utils.uid(),
        date: new Date().toISOString().slice(0, 10),
        title: "Meal off deadline reminder",
        message:
          "Please update tomorrow's meal count before 9:00 PM tonight. Entries after the deadline cannot be changed.",
      },
      {
        id: Utils.uid(),
        date: "2026-09-10",
        title: "New manager for this month",
        message: "Nayeem Khan will be handling bazar and accounts for this month. Please share receipts with him.",
      }
    );

    return data;
  }

  return { get, save, reset, init, insert, update, remove, emptyData };
})();
