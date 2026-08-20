/**
 * CrownBins Solutions Kenya - State Management
 * Handles reactive local storage, role-switching, and data operations
 */

class CrownBinsState {
  constructor() {
    this.STORAGE_KEY = "crownbins_app_state_v1";
    this.listeners = [];
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state, resetting to default.", e);
        this.resetToDefault();
      }
    } else {
      this.resetToDefault();
    }
  }

  resetToDefault() {
    this.state = {
      currentRole: "visitor", // visitor | customer | admin | super_admin
      currentCustomerId: "CUST-001",
      company: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.company)),
      bagTiers: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.bagTiers)),
      servicePlans: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.servicePlans)),
      bagQuantities: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.bagQuantities)),
      serviceAreas: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.serviceAreas)),
      trucks: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.trucks)),
      customers: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.customers)),
      invoices: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.invoices)),
      unmatchedPayments: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.unmatchedPayments)),
      complaints: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.complaints)),
      auditLogs: JSON.parse(JSON.stringify(window.CROWNBINS_DATA.auditLogs)),
      referrals: [
        { code: "CB-KAMAU24", referrer: "John Kamau Njoroge", uses: 3, earnedMonths: 1 }
      ]
    };
    this.save();
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Role & Auth Getters/Setters ---
  setRole(role, customerId = "CUST-001") {
    this.state.currentRole = role;
    if (customerId) {
      this.state.currentCustomerId = customerId;
    }
    this.addAuditLog(`Role switched to ${role.toUpperCase()}` + (role === "customer" ? ` (${customerId})` : ""));
    this.save();
  }

  getCurrentCustomer() {
    return this.state.customers.find(c => c.id === this.state.currentCustomerId) || this.state.customers[0];
  }

  // --- Invoice & Payment Operations ---
  createInvoice(invoiceData) {
    const newId = `INV-2026-${String(this.state.invoices.length + 843).padStart(4, '0')}`;
    const invoice = {
      id: newId,
      ...invoiceData,
      status: invoiceData.status || "Pending",
      transactionCode: invoiceData.transactionCode || null,
      date: invoiceData.date || new Date().toISOString().split('T')[0]
    };
    this.state.invoices.unshift(invoice);

    // Update customer current balance if pending
    if (invoice.status === "Pending") {
      const cust = this.state.customers.find(c => c.id === invoice.customerId);
      if (cust) {
        cust.currentBalance = (cust.currentBalance || 0) + invoice.total;
      }
    }

    this.addAuditLog(`Invoice ${newId} created for ${invoice.customerName} (KES ${invoice.total.toLocaleString()})`);
    this.save();
    return invoice;
  }

  payInvoice(invoiceId, method, transactionCode, sendChannels = ['sms', 'whatsapp']) {
    const inv = this.state.invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    inv.status = "Paid";
    inv.paymentMethod = method;
    inv.transactionCode = transactionCode || `QHK${Math.floor(100000 + Math.random() * 900000)}`;
    inv.paidDate = new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });

    // Deduct from customer balance
    const cust = this.state.customers.find(c => c.id === inv.customerId);
    if (cust) {
      cust.currentBalance = Math.max(0, (cust.currentBalance || 0) - inv.total);
      cust.accountStatus = "Active";
    }

    this.addAuditLog(`Payment confirmed for Invoice ${invoiceId} via ${method}. M-Pesa Code: ${inv.transactionCode}`);
    this.save();
    return inv;
  }

  // --- Reconciliation Queue ---
  matchUnmatchedPayment(paymentId, customerId, invoiceId) {
    const paymentIdx = this.state.unmatchedPayments.findIndex(p => p.id === paymentId);
    if (paymentIdx === -1) return false;
    const payment = this.state.unmatchedPayments[paymentIdx];

    const targetInvoice = invoiceId 
      ? this.state.invoices.find(i => i.id === invoiceId)
      : this.state.invoices.find(i => i.customerId === customerId && i.status !== "Paid");

    if (targetInvoice) {
      this.payInvoice(targetInvoice.id, payment.channel, payment.transactionCode);
    }

    // Remove from queue
    this.state.unmatchedPayments.splice(paymentIdx, 1);
    this.addAuditLog(`Unmatched payment ${payment.transactionCode} (${payment.amount} KES) matched to customer ${customerId}`);
    this.save();
    return true;
  }

  addManualMpesaCodeSubmission(customerId, code, amount, method = "Direct M-Pesa") {
    const cust = this.state.customers.find(c => c.id === customerId);
    const newUnmatched = {
      id: `UNM-${Math.floor(100 + Math.random() * 900)}`,
      channel: method,
      transactionCode: code.toUpperCase(),
      senderName: cust ? cust.name : "Portal Customer",
      senderPhone: cust ? cust.phone : "+254 700 000 000",
      amount: Number(amount) || 4500,
      dateTime: new Date().toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' }),
      suspectedCustomer: cust ? `${cust.name} (${customerId})` : "Portal Submission",
      status: "Unmatched"
    };
    this.state.unmatchedPayments.unshift(newUnmatched);
    this.addAuditLog(`Customer ${customerId} submitted transaction code ${code} for verification.`);
    this.save();
    return newUnmatched;
  }

  // --- Complaints / Missed Pickup ---
  raiseComplaint(complaintData) {
    const newId = `CMP-${this.state.complaints.length + 105}`;
    const newComplaint = {
      id: newId,
      customerId: complaintData.customerId || "CUST-001",
      customerName: complaintData.customerName || "Customer",
      category: complaintData.category || "Missed Pickup",
      subject: complaintData.subject,
      details: complaintData.details,
      date: new Date().toISOString().split('T')[0],
      status: "In Progress",
      assignedTo: "CrownBins Operations Desk",
      resolution: "Logged into route dispatch queue for rapid response."
    };
    this.state.complaints.unshift(newComplaint);
    this.addAuditLog(`Complaint ${newId} (${newComplaint.category}) logged by ${newComplaint.customerName}`);
    this.save();
    return newComplaint;
  }

  updateComplaintStatus(id, status, resolution, assignedTo) {
    const cmp = this.state.complaints.find(c => c.id === id);
    if (!cmp) return false;
    if (status) cmp.status = status;
    if (resolution) cmp.resolution = resolution;
    if (assignedTo) cmp.assignedTo = assignedTo;
    this.addAuditLog(`Complaint ${id} updated to status: ${status}`);
    this.save();
    return cmp;
  }

  // --- Route & Truck Assignment ---
  assignTruckToRoute(areaId, truckId) {
    const area = this.state.serviceAreas.find(a => a.id === areaId);
    const truck = this.state.trucks.find(t => t.id === truckId);
    if (area && truck) {
      area.truck = truck.name;
      truck.currentZone = area.name;
      this.addAuditLog(`Assigned ${truck.name} to route zone: ${area.name}`);
      this.save();
      return true;
    }
    return false;
  }

  // --- Customer CRUD ---
  addCustomer(customerData) {
    const newId = `CUST-${String(this.state.customers.length + 1).padStart(3, '0')}`;
    const customer = {
      id: newId,
      accountStatus: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      currentBalance: 0,
      nextCollectionDate: "Upcoming this week",
      ...customerData
    };
    this.state.customers.push(customer);
    this.addAuditLog(`New customer registered: ${customer.name} (${newId})`);
    this.save();
    return customer;
  }

  // --- CMS Content Editor ---
  updateCompanyContent(updates) {
    this.state.company = { ...this.state.company, ...updates };
    this.addAuditLog(`Company details and public content updated.`);
    this.save();
  }

  addServiceArea(area) {
    const newId = this.state.serviceAreas.length + 1;
    this.state.serviceAreas.push({ id: newId, status: "Active", truck: "Truck 01 (Isuzu NPR)", ...area });
    this.addAuditLog(`New service area added: ${area.name} (${area.county})`);
    this.save();
  }

  // --- Data Migration (Zoho One & CSV Export/Import) ---
  exportCustomersCSV() {
    const headers = ["Customer ID", "Full Name", "Email", "Phone", "Type", "Estate/Address", "Bag Type", "Bag Qty", "Subscription Months", "Monthly Rate KES", "Balance KES", "Status", "Join Date"];
    const rows = this.state.customers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      c.type,
      `"${c.estate}"`,
      c.bagType,
      c.bagQty,
      c.subscriptionMonths,
      c.monthlyRate,
      c.currentBalance,
      c.accountStatus,
      c.joinDate
    ]);
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  importCustomersCSV(csvText) {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return 0;
    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 4 && parts[1]) {
        this.addCustomer({
          name: parts[1] || "Imported Customer",
          email: parts[2] || "client@crownbins.co.ke",
          phone: parts[3] || "+254 700 000 000",
          type: parts[4] || "Residential (Apartment)",
          estate: parts[5] || "Nairobi Estate",
          bagType: parts[6] || "green",
          bagQty: Number(parts[7]) || 8,
          subscriptionMonths: Number(parts[8]) || 3,
          monthlyRate: Number(parts[9]) || 1500,
          frequency: "Twice weekly"
        });
        imported++;
      }
    }
    this.addAuditLog(`Imported ${imported} customer records from CSV (Zoho One format).`);
    this.save();
    return imported;
  }

  // --- Audit Log Utility ---
  addAuditLog(action) {
    const time = new Date().toLocaleString('en-KE', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
    this.state.auditLogs.unshift({
      timestamp: time,
      user: this.state.currentRole === "visitor" ? "Website Visitor" : (this.state.currentRole === "customer" ? `Customer (${this.state.currentCustomerId})` : `${this.state.currentRole.toUpperCase()}`),
      action: action
    });
    if (this.state.auditLogs.length > 50) this.state.auditLogs.pop();
  }
}

window.appState = new CrownBinsState();
