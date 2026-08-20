# CrownBins Solutions Kenya — Web Platform & Billing Engine

> **“One man's trash is another man's treasure.”**

A complete web platform and management system for **CrownBins Solutions Kenya**, providing reliable and sustainable residential & commercial waste collection services across Nairobi, Kiambu, and surrounding regions.

---

## 🌟 Key Features

### 🌐 1. Public Marketing Website
- **Hero Slider**: Rotating visuals of CrownBins collection trucks and sanitation crew.
- **Service Area Coverage Checker**: Live interactive search across Nairobi, Kiambu, Machakos, Nakuru, and Eldoret estates.
- **Bag Quality & Frequency Matrix**:
  - **Organic Green Bag**: Premium heavy-duty, 100% recyclable for domestic and organic waste.
  - **Standard Blue Bag**: Durable polyethylene for residential apartments and complexes.
  - **Economy Black Bag**: High-volume general & commercial waste.
- **Interactive Quotation Calculator**: Dynamic KES estimation for 3, 4, or 6-month subscriptions with direct WhatsApp deep-link negotiation.
- **Referral Programme**: Referral rewards and community eco-impact counters.
- **Report Missed Pickup Form**: Fast support ticket generator for route drivers.

### 👤 2. Customer Self-Service Portal
- **Dashboard**: Balance tracking in KES, collection countdown, and bag allocation details.
- **Payment Gateway**:
  - **M-Pesa STK Push Simulation**: Real-time push prompt simulation with instant receipt dispatch.
  - **M-Pesa Paybill (522522)** & **Till Number (8472910)** manual transaction code submission.
  - **Bank Transfer** (Equity, KCB, Stanbic, Co-op) & Cheque instructions.
- **Official Invoices & PDF Receipts**: Printable/downloadable branded documents with WhatsApp & Email sharing.
- **Collection Calendar**: Route schedules & extra-bag collection booking.
- **Customer Complaints Desk**: Raise and track tickets for missed pickups, damaged bins, and overpayment claims.

### 💼 3. Admin & Super Admin Operations Hub
- **Zoho-Style Invoicing Engine**: Kenyan billing workflow in KES with bag line items, automated discounts, and KRA PIN/VAT options.
- **Payment Reconciliation Queue**: Live queue to match direct M-Pesa Till/Paybill payments with customer accounts.
- **Truck & Route Dispatcher**: Assign trucks and drivers to neighborhood routes.
- **Customer Master Directory**: Searchable directory for 300+ customer records.
- **Super Admin & Data Migration**: Export/Import CSV files (compatible with Zoho One & Excel) and system audit logs.

---

## 🚀 Getting Started

### Local Setup
No build steps or complex dependencies required — this project is built with standard, high-performance HTML5, CSS3, and modern Vanilla JavaScript.

1. Clone or download the repository:
   ```bash
   git clone <your-github-repo-url>
   cd Garbage_Site
   ```

2. Open `index.html` in any modern web browser, or run a local HTTP server:
   ```bash
   # Using Python 3
   python3 -m http.server 3000
   ```

3. Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
Garbage_Site/
├── index.html              # Main application container with Public, Portal & Admin views
├── css/
│   ├── styles.css          # Design tokens, typography, hero slider, public sections
│   ├── components.css      # Reusable buttons, modals, badges, forms, toast notifications
│   └── dashboards.css      # Customer & Admin dashboard widgets, Zoho-style invoicing
├── js/
│   ├── app.js              # Navigation, hero carousel, quote estimator, service area search
│   ├── data.js             # Initial mock data (customers, trucks, areas, bag tiers)
│   ├── state.js            # Reactive state management with local persistence
│   ├── portal.js           # Customer portal logic, M-Pesa STK Push simulation
│   ├── admin.js            # Admin hub, Zoho invoicing engine, truck dispatch
│   └── pdf-generator.js    # Printable/downloadable branded PDF invoices & receipts
└── assets/
    └── images/             # Branded photography of collection trucks & crew
```

---

## 📄 License
© 2026 CrownBins Solutions Kenya Ltd. All Rights Reserved.
