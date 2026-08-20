/**
 * CrownBins Solutions Kenya - Initial Mock Dataset
 * Contains realistic default data matching CrownBins_Requirements-3.docx
 */

window.CROWNBINS_DATA = {
  company: {
    name: "CrownBins Solutions Kenya",
    legalName: "CrownBins Solutions Kenya Ltd",
    tagline: "One man's trash is another man's treasure.",
    mission: "To provide reliable and environmentally responsible waste collection services.",
    vision: "To transform waste management into a sustainable solution for cleaner communities.",
    phone: "+254 712 345 678",
    whatsapp: "+254 712 345 678",
    email: "info@crownbins.co.ke",
    supportEmail: "support@crownbins.co.ke",
    billingEmail: "billing@crownbins.co.ke",
    address: "CrownBins Plaza, 3rd Floor, Mombasa Road / Enterprise Rd Junction, Industrial Area, Nairobi, Kenya",
    kraPin: "P051982743X",
    paybill: "522522",
    tillNumber: "8472910",
    accountNumber: "CROWNBINS",
    currency: "KES",
    banks: [
      { name: "Equity Bank", accountName: "CrownBins Solutions Kenya Ltd", accountNumber: "0180293847192", branch: "Supreme Centre" },
      { name: "KCB Bank", accountName: "CrownBins Solutions Kenya Ltd", accountNumber: "1283940192", branch: "Industrial Area" },
      { name: "Stanbic Bank", accountName: "CrownBins Solutions Kenya Ltd", accountNumber: "0100492817281", branch: "Upper Hill" },
      { name: "Co-operative Bank", accountName: "CrownBins Solutions Kenya Ltd", accountNumber: "01129384719200", branch: "Nairobi Business Hub" }
    ]
  },

  bagTiers: [
    {
      id: "green",
      name: "Organic Green Bag",
      color: "#16A34A",
      bgClass: "bag-green",
      badge: "Premium Heavy-Duty",
      description: "100% Recyclable, tear-resistant heavy duty bags ideal for mixed domestic & organic household waste.",
      priceRange: "KES 1,200 - 1,800 / month",
      baseRatePerMonth: 1500,
      bestFor: "Individual Residences & Eco-conscious Homes",
      icon: "leaf"
    },
    {
      id: "blue",
      name: "Standard Blue Bag",
      color: "#2563EB",
      bgClass: "bag-blue",
      badge: "Standard Durable",
      description: "Reinforced medium-density polyethylene bags for standard domestic and dry apartment waste.",
      priceRange: "KES 900 - 1,400 / month",
      baseRatePerMonth: 1200,
      bestFor: "Apartments & Gated Communities",
      icon: "shield"
    },
    {
      id: "black",
      name: "Economy Black Bag",
      color: "#1F2937",
      bgClass: "bag-black",
      badge: "Commercial / General",
      description: "Standard industrial grade black bags suitable for high-volume general and non-hazardous commercial waste.",
      priceRange: "KES 700 - 1,100 / month",
      baseRatePerMonth: 950,
      bestFor: "Commercial Shops, Offices & General Waste",
      icon: "trash-2"
    }
  ],

  servicePlans: [
    { id: "quarterly", name: "3 Months (Quarterly)", months: 3, discount: 0, label: "Quarterly Billing" },
    { id: "four_months", name: "4 Months", months: 4, discount: 5, label: "4-Month Subscription (5% off)" },
    { id: "semi_annual", name: "6 Months (Semi-Annual)", months: 6, discount: 10, label: "Semi-Annual Subscription (10% off)" }
  ],

  bagQuantities: [
    { qty: 4, frequency: "Once per week (4 bags / month)", tag: "1x Weekly" },
    { qty: 8, frequency: "Twice per week (8 bags / month)", tag: "2x Weekly Standard" },
    { qty: 10, frequency: "Twice per week (10 bags / month)", tag: "2x Weekly Large Family" },
    { qty: 12, frequency: "Twice per week (12 bags / month)", tag: "2x Weekly Maximum" }
  ],

  serviceAreas: [
    { id: 1, name: "Kilimani & Hurlingham", county: "Nairobi", status: "Active", days: "Tuesdays & Fridays", truck: "Truck 01 (Isuzu NPR)" },
    { id: 2, name: "Westlands & Parklands", county: "Nairobi", status: "Active", days: "Mondays & Thursdays", truck: "Truck 02 (Mitsubishi Fuso)" },
    { id: 3, name: "Karen & Lang'ata", county: "Nairobi", status: "Active", days: "Wednesdays & Saturdays", truck: "Truck 03 (Isuzu FRR)" },
    { id: 4, name: "Lavington & Kileleshwa", county: "Nairobi", status: "Active", days: "Tuesdays & Fridays", truck: "Truck 01 (Isuzu NPR)" },
    { id: 5, name: "South B & South C", county: "Nairobi", status: "Active", days: "Mondays & Thursdays", truck: "Truck 02 (Mitsubishi Fuso)" },
    { id: 6, name: "Roysambu & Kasarani", county: "Nairobi", status: "Active", days: "Wednesdays & Saturdays", truck: "Truck 03 (Isuzu FRR)" },
    { id: 7, name: "Ruiru & Kahawa Sukari", county: "Kiambu", status: "Active", days: "Tuesdays & Fridays", truck: "Truck 04 (Fuso Fighter)" },
    { id: 8, name: "Kikuyu & Ndenderu", county: "Kiambu", status: "Active", days: "Mondays & Thursdays", truck: "Truck 04 (Fuso Fighter)" },
    { id: 9, name: "Thika Town & Section 9", county: "Kiambu", status: "Active", days: "Wednesdays & Saturdays", truck: "Truck 04 (Fuso Fighter)" },
    { id: 10, name: "Syokimau & Athi River", county: "Machakos", status: "Active", days: "Tuesdays & Fridays", truck: "Truck 02 (Mitsubishi Fuso)" },
    { id: 11, name: "Nakuru City & Milimani", county: "Nakuru", status: "Expansion Phase 1", days: "Launching Sept 2026", truck: "Allocating" },
    { id: 12, name: "Eldoret Town & Elgon View", county: "Uasin Gishu", status: "Expansion Phase 2", days: "Launching Q4 2026", truck: "Allocating" }
  ],

  trucks: [
    { id: "TRK-01", name: "Truck 01 (Isuzu NPR)", regNumber: "KDL 240S", driver: "Moses Omondi", capacity: "4.5 Tons", status: "On Route", currentZone: "Kilimani / Lavington" },
    { id: "TRK-02", name: "Truck 02 (Mitsubishi Fuso)", regNumber: "KDG 892M", driver: "Erick Mwangi", capacity: "6.0 Tons", status: "On Route", currentZone: "Westlands / Parklands" },
    { id: "TRK-03", name: "Truck 03 (Isuzu FRR)", regNumber: "KDM 512P", driver: "Dennis Kiprono", capacity: "7.5 Tons", status: "Standby", currentZone: "Karen Depot" },
    { id: "TRK-04", name: "Truck 04 (Fuso Fighter)", regNumber: "KDE 331Q", driver: "Peter Wanyonyi", capacity: "5.0 Tons", status: "On Route", currentZone: "Kiambu / Ruiru Corridor" }
  ],

  customers: [
    {
      id: "CUST-001",
      name: "John Kamau Njoroge",
      email: "john.kamau@gmail.com",
      phone: "+254 722 849 102",
      type: "Residential (Apartment)",
      estate: "Kilimani, Denis Pritt Rd, Greenview Heights Apt 4B",
      bagType: "green",
      bagQty: 8,
      frequency: "Twice weekly (Tue & Fri)",
      subscriptionMonths: 3,
      monthlyRate: 1500,
      currentBalance: 4500,
      accountStatus: "Active",
      nextCollectionDate: "2026-08-21 (Friday)",
      preferredNotification: "whatsapp",
      joinDate: "2024-03-15"
    },
    {
      id: "CUST-002",
      name: "Sarah Wanjiku Mwangi",
      email: "sarah.wanjiku@outlook.com",
      phone: "+254 714 590 321",
      type: "Residential (Individual)",
      estate: "Lavington, James Gichuru Road, House 12",
      bagType: "green",
      bagQty: 10,
      frequency: "Twice weekly (Tue & Fri)",
      subscriptionMonths: 6,
      monthlyRate: 1700,
      currentBalance: 0,
      accountStatus: "Active",
      nextCollectionDate: "2026-08-21 (Friday)",
      preferredNotification: "sms",
      joinDate: "2023-11-10"
    },
    {
      id: "CUST-003",
      name: "Dr. David Kipkemboi",
      email: "david.kemboi@apexmed.co.ke",
      phone: "+254 733 902 114",
      type: "Commercial (Clinic & Office)",
      estate: "Westlands, Woodvale Grove, Apex Plaza 2nd Fl",
      bagType: "black",
      bagQty: 12,
      frequency: "Twice weekly (Mon & Thu)",
      subscriptionMonths: 4,
      monthlyRate: 2400,
      currentBalance: 9600,
      accountStatus: "Overdue (1 reminder sent)",
      nextCollectionDate: "2026-08-20 (Thursday)",
      preferredNotification: "email",
      joinDate: "2024-01-08"
    },
    {
      id: "CUST-004",
      name: "Fatuma Hassan Ali",
      email: "fatuma.hassan@gmail.com",
      phone: "+254 720 183 992",
      type: "Residential (Apartment)",
      estate: "South C, Muhoho Avenue, Sunrise Court B8",
      bagType: "blue",
      bagQty: 8,
      frequency: "Twice weekly (Mon & Thu)",
      subscriptionMonths: 3,
      monthlyRate: 1200,
      currentBalance: 0,
      accountStatus: "Active",
      nextCollectionDate: "2026-08-20 (Thursday)",
      preferredNotification: "whatsapp",
      joinDate: "2024-05-20"
    },
    {
      id: "CUST-005",
      name: "Kileleshwa Garden Residences HOA",
      email: "management@kileleshwagardens.co.ke",
      phone: "+254 701 455 890",
      type: "Commercial (Estate Association)",
      estate: "Kileleshwa, Kandara Road, 48-Unit Complex",
      bagType: "blue",
      bagQty: 12,
      frequency: "Twice weekly (Tue & Fri)",
      subscriptionMonths: 6,
      monthlyRate: 14500,
      currentBalance: 0,
      accountStatus: "Active",
      nextCollectionDate: "2026-08-21 (Friday)",
      preferredNotification: "whatsapp",
      joinDate: "2023-08-01"
    }
  ],

  invoices: [
    {
      id: "INV-2026-0842",
      customerId: "CUST-001",
      customerName: "John Kamau Njoroge",
      customerPhone: "+254 722 849 102",
      customerEmail: "john.kamau@gmail.com",
      customerAddress: "Kilimani, Denis Pritt Rd, Greenview Heights Apt 4B",
      date: "2026-08-10",
      dueDate: "2026-08-24",
      period: "15 Aug 2026 - 15 Nov 2026 (3 Months)",
      bagType: "Green Organic Heavy-Duty",
      bagQty: 8,
      subscriptionMonths: 3,
      ratePerMonth: 1500,
      subtotal: 4500,
      discount: 0,
      tax: 0,
      total: 4500,
      status: "Pending",
      paymentMethod: "M-Pesa / Bank",
      transactionCode: null,
      notes: "Garbage collection twice weekly (Tuesdays & Fridays). Please include bag distribution."
    },
    {
      id: "INV-2026-0830",
      customerId: "CUST-002",
      customerName: "Sarah Wanjiku Mwangi",
      customerPhone: "+254 714 590 321",
      customerEmail: "sarah.wanjiku@outlook.com",
      customerAddress: "Lavington, James Gichuru Road, House 12",
      date: "2026-07-28",
      dueDate: "2026-08-11",
      period: "01 Aug 2026 - 31 Jan 2027 (6 Months)",
      bagType: "Green Organic Heavy-Duty",
      bagQty: 10,
      subscriptionMonths: 6,
      ratePerMonth: 1700,
      subtotal: 10200,
      discount: 1020,
      tax: 0,
      total: 9180,
      status: "Paid",
      paymentMethod: "Safaricom M-Pesa (Till)",
      transactionCode: "QHK82910KP",
      paidDate: "2026-08-02 09:14 AM",
      notes: "Semi-Annual Subscription with 10% loyalty discount applied."
    },
    {
      id: "INV-2026-0815",
      customerId: "CUST-003",
      customerName: "Dr. David Kipkemboi",
      customerPhone: "+254 733 902 114",
      customerEmail: "david.kemboi@apexmed.co.ke",
      customerAddress: "Westlands, Woodvale Grove, Apex Plaza 2nd Fl",
      date: "2026-07-15",
      dueDate: "2026-07-29",
      period: "01 Aug 2026 - 30 Nov 2026 (4 Months)",
      bagType: "Black Commercial Heavy-Duty",
      bagQty: 12,
      subscriptionMonths: 4,
      ratePerMonth: 2400,
      subtotal: 9600,
      discount: 0,
      tax: 0,
      total: 9600,
      status: "Overdue",
      paymentMethod: "Bank Transfer",
      transactionCode: null,
      reminderCount: 2,
      notes: "Commercial office waste collection. Overdue reminder sent via Email & SMS."
    },
    {
      id: "INV-2026-0801",
      customerId: "CUST-004",
      customerName: "Fatuma Hassan Ali",
      customerPhone: "+254 720 183 992",
      customerEmail: "fatuma.hassan@gmail.com",
      customerAddress: "South C, Muhoho Avenue, Sunrise Court B8",
      date: "2026-07-05",
      dueDate: "2026-07-19",
      period: "15 Jul 2026 - 15 Oct 2026 (3 Months)",
      bagType: "Blue Standard Durable",
      bagQty: 8,
      subscriptionMonths: 3,
      ratePerMonth: 1200,
      subtotal: 3600,
      discount: 0,
      tax: 0,
      total: 3600,
      status: "Paid",
      paymentMethod: "Safaricom M-Pesa (Paybill)",
      transactionCode: "QHJ47812ML",
      paidDate: "2026-07-08 04:30 PM",
      notes: "Regular residential collection."
    }
  ],

  unmatchedPayments: [
    {
      id: "UNM-091",
      channel: "M-Pesa Till 8472910",
      transactionCode: "QHL58920KA",
      senderName: "Grace Muthoni",
      senderPhone: "+254 729 481 002",
      amount: 4500,
      dateTime: "2026-08-18 11:23 AM",
      suspectedCustomer: "John Kamau Njoroge (INV-2026-0842 - KES 4,500)",
      status: "Unmatched"
    },
    {
      id: "UNM-092",
      channel: "M-Pesa Paybill 522522",
      transactionCode: "QHL41908ZB",
      senderName: "Bernard Kiprotich",
      senderPhone: "+254 711 672 990",
      amount: 3600,
      dateTime: "2026-08-17 03:45 PM",
      suspectedCustomer: "Fatuma Hassan Ali or New Subscriber",
      status: "Unmatched"
    },
    {
      id: "UNM-093",
      channel: "Equity Bank Transfer",
      transactionCode: "FT2623098716",
      senderName: "Apex Medical Services Ltd",
      senderPhone: "+254 733 902 114",
      amount: 9600,
      dateTime: "2026-08-18 09:10 AM",
      suspectedCustomer: "Dr. David Kipkemboi (INV-2026-0815 - KES 9,600)",
      status: "Unmatched"
    }
  ],

  complaints: [
    {
      id: "CMP-104",
      customerId: "CUST-001",
      customerName: "John Kamau Njoroge",
      category: "Missed Pickup",
      subject: "Truck missed Friday collection at Greenview Heights Apt 4B",
      details: "Our bags were placed at the gate by 7:30 AM but were not picked during the regular morning route.",
      date: "2026-08-15",
      status: "In Progress",
      assignedTo: "Moses Omondi (Truck 01)",
      resolution: "Route driver contacted; special re-route collection scheduled for today 4:00 PM."
    },
    {
      id: "CMP-103",
      customerId: "CUST-003",
      customerName: "Dr. David Kipkemboi",
      category: "Billing Issue / Overpayment",
      subject: "Inquiry regarding multiple remittance receipt",
      details: "Requested updated statement reflecting recent cheque deposit for Apex Plaza.",
      date: "2026-08-12",
      status: "Resolved",
      assignedTo: "CrownBins Accounts Desk",
      resolution: "Cheque confirmed and statement dispatched via WhatsApp and PDF download."
    },
    {
      id: "CMP-102",
      customerId: "CUST-004",
      customerName: "Fatuma Hassan Ali",
      category: "Damaged Bin / Bag Delivery",
      subject: "Requesting additional green recycling rolls for upcoming quarter",
      details: "Customer requested 4 extra bags for yard waste cleanup.",
      date: "2026-08-05",
      status: "Resolved",
      assignedTo: "Erick Mwangi (Truck 02)",
      resolution: "Bags delivered and handed to caretaker."
    }
  ],

  auditLogs: [
    { timestamp: "2026-08-18 15:40", user: "System (Super Admin)", action: "Auto-reconciliation job ran successfully. 4 invoices verified." },
    { timestamp: "2026-08-18 11:23", user: "M-Pesa Webhook API", action: "Received direct payment KES 4,500 (Code: QHL58920KA). Added to Unmatched Queue." },
    { timestamp: "2026-08-17 14:05", user: "Admin (Operations)", action: "Generated Invoice INV-2026-0842 for John Kamau Njoroge (KES 4,500)." },
    { timestamp: "2026-08-16 09:30", user: "Admin (Dispatch)", action: "Assigned Truck 01 (KDL 240S) to Kilimani / Lavington route." },
    { timestamp: "2026-08-15 16:15", user: "Customer Portal", action: "Complaint CMP-104 logged by John Kamau Njoroge." }
  ]
};
