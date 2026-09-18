/**
 * calc.js
 * All the "mess accounting" math lives here in one place so the Overview,
 * Meals, and Reports sections always agree with each other.
 */

const Calc = (() => {
  /** Total meals eaten by everyone, optionally filtered to one month ('YYYY-MM'). */
  function totalMeals(meals, monthKey = null) {
    return meals
      .filter((m) => !monthKey || m.date.startsWith(monthKey))
      .reduce((sum, m) => sum + Number(m.count), 0);
  }

  /** Total bazar (grocery) spend, optionally filtered to one month. */
  function totalBazar(bazar, monthKey = null) {
    return bazar
      .filter((b) => !monthKey || b.date.startsWith(monthKey))
      .reduce((sum, b) => sum + Number(b.amount), 0);
  }

  /** Total deposits collected, optionally filtered to one month. */
  function totalDeposits(deposits, monthKey = null) {
    return deposits
      .filter((d) => !monthKey || d.date.startsWith(monthKey))
      .reduce((sum, d) => sum + Number(d.amount), 0);
  }

  /** Cost per single meal = total bazar spend / total meals eaten. */
  function mealRate(meals, bazar, monthKey = null) {
    const meals_ = totalMeals(meals, monthKey);
    const bazar_ = totalBazar(bazar, monthKey);
    if (meals_ === 0) return 0;
    return bazar_ / meals_;
  }

  /**
   * Full per-member ledger for a given month:
   * meals eaten, cost owed, deposits paid, and running balance.
   * A positive balance means the member is in credit (paid more than owed).
   */
  function memberLedger(data, monthKey = null) {
    const rate = mealRate(data.meals, data.bazar, monthKey);
    return data.members.map((member) => {
      const myMeals = data.meals
        .filter((m) => m.memberId === member.id && (!monthKey || m.date.startsWith(monthKey)))
        .reduce((sum, m) => sum + Number(m.count), 0);
      const myDeposits = data.deposits
        .filter((d) => d.memberId === member.id && (!monthKey || d.date.startsWith(monthKey)))
        .reduce((sum, d) => sum + Number(d.amount), 0);
      const cost = myMeals * rate;
      return {
        member,
        meals: myMeals,
        cost,
        deposits: myDeposits,
        balance: myDeposits - cost,
      };
    });
  }

  /** Meals-per-day series for the last N days, for charting. */
  function dailyMealSeries(meals, days = 14) {
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = Utils.addDays(Utils.todayStr(), -i);
      const total = meals.filter((m) => m.date === date).reduce((s, m) => s + Number(m.count), 0);
      out.push({ date, total });
    }
    return out;
  }

  /** Bazar spend grouped by ISO week for the last N weeks, for charting. */
  function weeklyBazarSeries(bazar, weeks = 6) {
    const buckets = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const end = Utils.addDays(Utils.todayStr(), -i * 7);
      const start = Utils.addDays(end, -6);
      const total = bazar
        .filter((b) => b.date >= start && b.date <= end)
        .reduce((s, b) => s + Number(b.amount), 0);
      buckets.push({ label: `${start.slice(5)}→${end.slice(5)}`, total });
    }
    return buckets;
  }

  return { totalMeals, totalBazar, totalDeposits, mealRate, memberLedger, dailyMealSeries, weeklyBazarSeries };
})();
