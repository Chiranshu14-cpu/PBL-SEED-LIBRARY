# SEED VAULT — Village Seed Library Management Platform
### B.Tech Computer Science and Engineering — Project-Based Learning (PBL)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Academic Project](https://img.shields.io/badge/PBL-B.Tech%20CSE-orange.svg)](#)

---

## 1. Project Overview

**SEED VAULT** is a comprehensive, production-grade, full-stack digital platform designed to help village communities, local farmers, panchayats, and agricultural extension workers manage community seed banks. 

Traditional agricultural ecosystems rely on open-pollinated, non-hybrid, climate-resilient heritage varieties. However, lack of structured cataloguing, physical loss, and commercial hybrid dependency have threatened rural seed sovereignty. **Seed Vault** addresses this crisis by digitizing:
- **Seed Cataloguing & Agronomic Profiling** for 15 indigenous heritage varieties.
- **Controlled Seed Borrowing (Loans)** with automated return due dates.
- **Physical Seed Viability Verification & Restocking Workflow** by seed librarians.
- **Separated Monetary Purchasing vs Seed Mass Accounting** (keeping monetary bills strictly distinct from physical seed weights).
- **Gamified Community Engagement (Seed Guardian Points & Badges)** to reward timely returns and landrace deposits.
- **Full Trilingual Multilingual Support** across English, Marathi (मराठी), and Hindi (हिन्दी).
- **Individual Crop Lifecycle Tracker (My Garden)** tracking 7 distinct plant growth phases.

---

## 2. Key Objectives

1. **Biodiversity Preservation:** Catalogue, preserve, and safeguard indigenous non-hybrid landraces (vegetables, herbs, pulses, grains, and flowers).
2. **Rural Accessibility:** Provide a clean, nature-inspired, highly responsive user interface operable on village smartphones, tablets, and desktop computers.
3. **Accountability & Stewardship:** Replace fragile paper ledgers with atomic database transactions preventing stock discrepancies.
4. **Community Incentivization:** Encourage farmers to return seeds through the gamified *Seed Guardian Points* system.
5. **Academic Rigor:** Demonstrate software engineering best practices including MVC architectural separation, JWT authentication, bcrypt encryption, role-based authorization, rate limiting, and RESTful API design.

---

## 3. Technology Stack

### Frontend
- **Framework:** React.js (Vite Architecture, React 19)
- **Styling:** Custom Nature-Inspired Agricultural Design System (CSS3 with modern design tokens)
- **Theme Palette:**
  - Forest Green: `#164B35`
  - Deep Green: `#0D3526`
  - Sage Green: `#A8BFA3`
  - Warm Cream: `#F7F5EA`
  - Golden Yellow: `#D9A441`
  - Clean White: `#FFFFFF`
- **Icons:** Lucide Icons (`lucide-react`)
- **Animations:** Subtle CSS transitions and `canvas-confetti` celebrations

### Backend
- **Runtime:** Node.js (v24 LTS)
- **Framework:** Express.js (RESTful API architecture)
- **Security & Reliability:**
  - `bcryptjs` password hashing (salt rounds: 10)
  - `jsonwebtoken` (JWT) session tokens with 7-day expiration
  - `express-rate-limit` for brute-force protection on authentication endpoints
  - `cors` configuration supporting cross-origin requests
  - `morgan` HTTP request logger

### Database & ODM
- **Database:** MongoDB (Local or MongoDB Atlas)
- **Object Data Modeling (ODM):** Mongoose v9
- **Atomic Operations:** Stock decrements and increments handled atomically (`$inc`) to prevent race conditions.

---

## 4. System Architecture

```
seed-vault/
├── client/                     # Frontend React SPA
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── assets/             # Images & SVGs
│   │   ├── components/         # Modular reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation, language selector, cart indicators
│   │   │   ├── Footer.jsx      # Village desk info, PBL badges
│   │   │   ├── SeedCard.jsx    # Seed display card with actions
│   │   │   ├── SeedModal.jsx   # Detailed cultivation specifications modal
│   │   │   ├── CartDrawer.jsx  # Distinct purchase & borrowing carts
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx # JWT state, user session
│   │   │   ├── CartContext.jsx # Purchase & borrow state (weight vs price strictly distinct)
│   │   │   ├── LanguageContext.jsx # Trilingual i18n
│   │   │   └── NotificationContext.jsx # In-app notifications & toast manager
│   │   ├── pages/              # Role-specific and public views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CataloguePage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LibrarianDashboard.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── BorrowingManagementPage.jsx
│   │   │   ├── ReturnManagementPage.jsx
│   │   │   ├── DepositPage.jsx
│   │   │   ├── MyGardenPage.jsx
│   │   │   ├── SeedGuardianPointsPage.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── ActivityHistoryPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Fetch API with JWT interceptor
│   │   ├── translations/       # English, Hindi, Marathi dictionaries
│   │   │   ├── en.js
│   │   │   ├── hi.js
│   │   │   ├── mr.js
│   │   │   └── index.js
│   │   ├── index.css           # Global design tokens and responsive styles
│   │   ├── App.jsx             # Main routing orchestrator
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js / Express API
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── controllers/            # Controller logic for all features
│   │   ├── authController.js
│   │   ├── seedController.js
│   │   ├── purchaseController.js
│   │   ├── borrowController.js
│   │   ├── returnController.js
│   │   ├── depositController.js
│   │   ├── gardenController.js
│   │   ├── inventoryController.js
│   │   ├── pointsController.js
│   │   ├── notificationController.js
│   │   ├── feedbackController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & role-based access control
│   │   ├── errorHandler.js     # Centralized error handler
│   │   └── rateLimiter.js      # Anti-brute force limiter
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Seed.js
│   │   ├── Purchase.js
│   │   ├── BorrowRequest.js
│   │   ├── Return.js
│   │   ├── SeedDeposit.js
│   │   ├── GardenEntry.js
│   │   ├── Notification.js
│   │   ├── Feedback.js
│   │   └── ActivityLog.js
│   ├── routes/                 # Express API routes
│   ├── scripts/
│   │   └── seedDatabase.js     # Seeds 15 varieties, 1,440 packets, 51.05 kg weight
│   ├── .env                    # Local environment config
│   ├── .env.example
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── .gitignore
├── .env.example
├── README.md
└── package.json                # Root package manager
```

---

## 5. Seed Varieties & Demonstration Inventory

The initial database seed configuration implements exactly the 15 required indigenous varieties with:
- **Total Initial Packets:** `1,440` packets
- **Combined Seed Mass:** `51.05 kg` (51,050 grams)

| # | Seed Variety | Vernacular (Hi / Mr) | Botanical Name | Category | Pkt Weight | Initial Packets | Total Mass |
|---|---|---|---|---|---|---|---|
| 1 | **Tomato** | टमाटर / टोमॅटो | *Solanum lycopersicum* | Vegetables | 10g | 120 pkts | 1.20 kg |
| 2 | **Brinjal** | बैंगन / वांगी | *Solanum melongena* | Vegetables | 10g | 100 pkts | 1.00 kg |
| 3 | **Okra** | भिंडी / भेंडी | *Abelmoschus esculentus* | Vegetables | 25g | 100 pkts | 2.50 kg |
| 4 | **Green Chilli** | हरी मिर्च / मिरची | *Capsicum annuum* | Vegetables | 10g | 110 pkts | 1.10 kg |
| 5 | **Cucumber** | खीरा / काकडी | *Cucumis sativus* | Vegetables | 20g | 90 pkts | 1.80 kg |
| 6 | **Pumpkin** | कद्दू / भोपळा | *Cucurbita moschata* | Vegetables | 25g | 80 pkts | 2.00 kg |
| 7 | **Spinach** | पालक / पालक | *Spinacia oleracea* | Vegetables | 50g | 120 pkts | 6.00 kg |
| 8 | **Radish** | मूली / मुळा | *Raphanus sativus* | Vegetables | 30g | 100 pkts | 3.00 kg |
| 9 | **Carrot** | गाजर / गाजर | *Daucus carota* | Vegetables | 25g | 100 pkts | 2.50 kg |
| 10 | **Fenugreek** | मेथी / मेथी | *Trigonella foenum-graecum* | Herbs | 50g | 110 pkts | 5.50 kg |
| 11 | **Coriander** | धनिया / कोथिंबीर | *Coriandrum sativum* | Herbs | 50g | 110 pkts | 5.50 kg |
| 12 | **Chickpea** | देसी चना / हरभरा | *Cicer arietinum* | Pulses | 100g | 80 pkts | 8.00 kg |
| 13 | **Green Gram** | मूंग / मूग | *Vigna radiata* | Pulses | 75g | 80 pkts | 6.00 kg |
| 14 | **Maize** | मक्का / मका | *Zea mays* | Grains | 75g | 60 pkts | 4.50 kg |
| 15 | **Sunflower** | सूरजमुखी / सूर्यफूल | *Helianthus annuus* | Flowers | 5.625g | 80 pkts | 0.45 kg |
| **TOTAL** | **15 Varieties** | — | — | **5 Categories** | — | **1,440 pkts** | **51.05 kg** |

---

## 6. Role-Based Access Control (RBAC)

The application enforces 3 distinct, strictly isolated roles:

### 1. ADMIN (`admin`)
- Full platform visibility and governance.
- Add, edit, adjust, and audit seed varieties and stocks.
- View all member transactions, financial purchases, and loan histories.
- Manage user profiles and permissions.
- Reply directly to farmer feedback reviews.

### 2. SEED LIBRARIAN (`librarian`)
- Daily operations workstation.
- Review and approve/reject seasonal borrow requests.
- Inspect returned seed batches for physical purity and germination viability.
- Restock inventory upon successful return verification and award Guardian Points.
- Review community seed deposits.

### 3. FARMER / MEMBER (`farmer`)
- Browse catalogue with filters (category, availability, search, price, alphabetical).
- Add seeds to Purchase Cart (simulated checkout with strictly segregated weight and monetary billing).
- Submit seasonal Borrow Requests (free loans for village multiplication).
- Track return due dates with days remaining countdown.
- Log crops in **My Garden** through 7 growth stages:
  1. *Seed Planted* → 2. *Germination* → 3. *Seedling* → 4. *Vegetative Growth* → 5. *Flowering* → 6. *Harvest Ready* → 7. *Harvested*.
- Earn **Seed Guardian Points** and unlock badges.

---

## 7. Demonstration Accounts (Fast Evaluator Login)

For PBL academic demonstration, three pre-seeded accounts are provided with pre-populated records:

| Role | Email Address | Password | Name & Village |
|---|---|---|---|
| **ADMIN** | `admin@seedvault.org` | `Admin@123` | Dr. Rameshwar Patil (Agri Officer, Ralegan Siddhi) |
| **SEED LIBRARIAN** | `librarian@seedvault.org` | `Librarian@123` | Sunita Deshmukh (Seed Librarian, Ralegan Siddhi) |
| **FARMER** | `farmer@seedvault.org` | `Farmer@123` | Tukaram Shinde (Village Farmer, 185 Points) |

*Tip: The Login page includes one-click "Demo Fast-Login" buttons to instantly fill credentials during evaluation.*

---

## 8. Installation & Setup Instructions

### Prerequisites
- **Node.js:** v18+ (v24 recommended)
- **npm:** v9+
- **MongoDB:** Community Server running locally on port 27017 or a MongoDB Atlas connection string.

### Step 1: Clone or Open Workspace
Open the project root directory in Visual Studio Code:
```bash
cd "c:\Users\CHIRANSHU\Documents\PBL ANTI SEED"
```

### Step 2: Configure Environment Variables
Verify or create `.env` in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/seed_vault
JWT_SECRET=seedvault_super_secret_jwt_key_2026_btech_cse_pbl
NODE_ENV=development
```

### Step 3: Seed the Database
Populate the 15 varieties, initial users, sample garden records, and activity logs:
```bash
npm run seed
```
Output:
```
[Seed Script] Successfully seeded 15 varieties!
[Seed Script] Total Initial Stock: 1440 packets (Expected: 1,440)
[Seed Script] Total Combined Seed Weight: 51.05 kg (Expected: 51.05 kg)
```

### Step 4: Run the Application

You can start the backend and frontend concurrently in two terminals:

**Terminal 1 (Backend API):**
```bash
npm run server
```
*Backend runs on:* `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)

**Terminal 2 (Frontend Client):**
```bash
npm run client
```
*Frontend runs on:* `http://localhost:5173`

---

## 9. Key Workflows Demonstrated

### A. Strict Monetary vs Weight Accounting
- When seeds are added to the Purchase Cart, the application calculates:
  $$\text{Total Price} = \sum (\text{Price per Packet} \times \text{Quantity})$$
  $$\text{Total Weight} = \sum (\text{Packet Weight in Grams} \times \text{Quantity})$$
- The estimated bill is displayed in ₹ (INR), while physical seed weight is displayed separately in grams / kg.
- They are **never combined or conflated**.

### B. Borrowing & Restocking Lifecycle
1. Farmer requests 2 packets of *Tomato* seeds.
2. Status becomes `Pending`. Available stock is preserved.
3. Librarian approves loan via Desk: stock is decremented atomically, issue date is stamped, and a 90-day return due date is set.
4. Farmer cultivates and logs flowering/harvest in *My Garden*.
5. Farmer submits a return request with reported germination viability (e.g. 95%).
6. Librarian inspects physical seeds and clicks **Verify & Restock**: stock increments back into library availability, and the farmer is awarded **30+ Guardian Points**.

---

## 10. Limitations & Future Scope

### Current Academic Limitations
- Real payment gateways (e.g. Razorpay/Stripe) are simulated via cash-on-pickup and simulated UPI for village demonstration purposes.
- SMS OTP notifications use in-app alerts and simulated token modals rather than commercial paid GSM gateways.

### Future Scope
- Integration with Indian Meteorological Department (IMD) Agromet district weather forecasts.
- AI-based computer vision for automated seed purity and disease classification via smartphone camera.
- Blockchain-backed decentralized seed provenance ledger for rare indigenous germplasm lines.

---

## 11. Academic Evaluation Note

This application was developed as a complete end-to-end B.Tech Computer Science and Engineering Project-Based Learning (PBL) project. All requirements specified in the project brief—including database normalization, role isolation, multilingual translation, cart logic, and inventory management—are fully functional with live MongoDB database persistence.

