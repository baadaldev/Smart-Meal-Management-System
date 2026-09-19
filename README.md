<div align="center">

  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4300-a447-11eb-908a-139a6edaec5c.gif" width="100%" height="8px" alt="Divider" />

  # 🍽️ Smart Meal Management System
  ### *Automated Mess Accounting, Bazar Tracking & Real-Time Ledger Engine*

  <p align="center">
    A lightweight, zero-dependency, and production-ready web application engineered to solve the real-world headache of hostel and shared mess accounting in Bangladesh and university dorms.
  </p>

  <!-- Badges -->
  <p align="center">
    <a href="https://baadaldev.github.io/Smart-Meal-Management-System/">
      <img src="https://img.shields.io/badge/LIVE_DEMO-Launch_App-DC2626?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=0a0a0a" alt="Live Demo" />
    </a>
    &nbsp;
    <a href="https://github.com/baadaldev/Smart-Meal-Management-System/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-007ACC?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=0a0a0a" alt="License" />
    </a>
    &nbsp;
    <a href="https://github.com/baadaldev">
      <img src="https://img.shields.io/badge/DIU-CSE_Undergraduate-111111?style=for-the-badge&logo=academia&logoColor=white&labelColor=0a0a0a" alt="DIU" />
    </a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JS" />
    <img src="https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-Modern_Responsive-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/Chart.js-Data_Analytics-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js" />
    <img src="https://img.shields.io/badge/Storage-Browser_LocalStorage-4285F4?style=flat-square" alt="LocalStorage" />
  </p>

  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4300-a447-11eb-908a-139a6edaec5c.gif" width="100%" height="8px" alt="Divider" />

</div>

<br/>

## 📌 Table of Contents
- [📖 The Real-World Problem](#-the-real-world-problem)
- [✨ Core Capabilities](#-core-capabilities)
- [📐 System Architecture & Data Flow](#-system-architecture--data-flow)
- [🧮 Accounting Engine & Mathematical Model](#-accounting-engine--mathematical-model)
- [🚀 Quick Start & Live Deployment](#-quick-start--live-deployment)
- [🔑 Demo Credentials](#-demo-credentials)
- [📂 Modular Codebase Architecture](#-modular-codebase-architecture)
- [🗺️ Future Engineering Roadmap](#️-future-engineering-roadmap)
- [👨‍💻 Author & Connect](#-author--connect)

---

## 📖 The Real-World Problem

In most student hostels and university messes across Bangladesh, daily meal counts, grocery purchases, and individual deposits are still recorded on paper notebooks or cluttered spreadsheet templates. 

This manual method introduces critical vulnerabilities:
* ❌ **Math Errors & Disputes:** Calculating fluctuating meal rates manually at month-end causes transparency disputes among roommates.
* ❌ **Lack of Privacy:** Individual members cannot verify their own credit or due without pestering the mess manager.
* ❌ **Lost Records:** Coffee spills or lost registers destroy weeks of accounting history.

**Smart Meal Management System** eliminates these pain points with a zero-setup, fully automated client-side web application featuring real-time ledger recalculation, interactive analytics, and granular role separation.

---

## ✨ Core Capabilities

| Feature Area | Implementation Highlights |
|:---|:---|
| 🔐 **Role-Based Access (RBAC)** | **Manager View** (full CRUD controls over meals, bazar logs, members, and deposits) vs. **Member View** (read-only personal statement). |
| 🍛 **Daily Meal Matrix** | High-speed entry grid allowing managers to record daily lunch/dinner counts with complete historical archiving. |
| 🛒 **Bazar Expense Tracker** | Comprehensive grocery logging with itemized cost, timestamp, and purchaser metadata. |
| 🧮 **Instant Ledger Engine** | Real-time calculation of dynamic meal rate (`total spend ÷ total meals`) and live balances (Advance / Due / Settled). |
| 📊 **Interactive Analytics** | Integrated with **Chart.js** — renders 14-day meal trend curves, 6-week grocery spending velocity, and per-member meal share charts. |
| 📤 **Spreadsheet CSV Export** | 1-Click export of the monthly closing balance sheet into standard spreadsheet-ready CSV format. |
| 📢 **Mess Notice Board** | Broadcast board for announcements, billing deadlines, and mess policies. |
| 📱 **Kitchen-Ready Responsive UI** | Hand-crafted responsive layout usable on smartphones inside the market or kitchen. |

---

## 📐 System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph UI_Layer ["🎨 Client Interface"]
        A[index.html - Login Portal] -->|Session Auth| B[dashboard.html - Shell]
        B --> C1[Meals Module]
        B --> C2[Bazar Log]
        B --> C3[Deposits Ledger]
        B --> C4[Visual Analytics]
    end

    subgraph Logic_Layer ["⚙️ Modular Business Logic"]
        C1 & C2 & C3 --> D[calc.js - Accounting Engine]
        D -->|Compute Meal Rate & Balances| E[reports.js - Monthly Summary]
        E -->|Render Charts| F[Chart.js Engine]
        E -->|Generate Data| G[CSV Exporter]
    end

    subgraph Data_Layer ["💾 Persistence Layer"]
        D <--> H[storage.js - Storage Gateway]
        H <--> I[(Browser LocalStorage)]
    end
