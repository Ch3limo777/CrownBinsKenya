/**
 * CrownBins Solutions Kenya - Admin & Super Admin Controller
 * Manages Zoho-style Invoicing, M-Pesa Reconciliation, Truck Dispatch, CMS, and Data Migration
 */

class AdminPortal {
  constructor() {
    this.init();
  }

  init() {
    window.appState.subscribe(() => {
      if (window.appState.state.currentRole === "admin" || window.appState.state.currentRole === "super_admin") {
        this.render();
      }
    });
  }

  render() {
    const state = window.appState.state;
    const isSuperAdmin = state.currentRole === "super_admin";

    // Toggle Super Admin UI sections
    document.querySelectorAll(".super-admin-only").forEach(el => {
      el.style.display = isSuperAdmin ? "" : "none";
    });

    // Render Metrics
    this.renderMetrics(state);

    // Render Tables
    this.renderRecentInvoicesTable(state.invoices);
    this.renderReconciliationQueue(state.unmatchedPayments);
    this.renderTruckDispatch(state.serviceAreas, state.trucks);
    this.renderCustomerDirectory(state.customers);
    this.renderComplaintsManager(state.complaints);
    this.renderAuditLogs(state.auditLogs);
    this.renderServiceAreasCMS(state.serviceAreas);

    // Initialize invoice form selects
    this.populateInvoiceFormSelects();
  }

  renderMetrics(state) {
    const totalCustomers = state.customers.length;
    const totalInvoices = state.invoices.length;
    const totalRevenue = state.invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidRevenue = state.invoices.filter(i => i.status === "Paid").reduce((sum, inv) => sum + inv.total, 0);
    const pendingRevenue = state.invoices.filter(i => i.status !== "Paid").reduce((sum, inv) => sum + inv.total, 0);
    const unmatchedCount = state.unmatchedPayments.length;

    const elCust = document.getElementById("admin-metric-customers");
    const elInv = document.getElementById("admin-metric-invoices");
    const elRev = document.getElementById("admin-metric-revenue");
    const elPaid = document.getElementById("admin-metric-paid");
    const elPending = document.getElementById("admin-metric-pending");
    const elUnmatched = document.getElementById("admin-metric-unmatched");

    if (elCust) elCust.textContent = totalCustomers + " (300+ Active Base)";
    if (elInv) elInv.textContent = totalInvoices;
    if (elRev) elRev.textContent = `KES ${totalRevenue.toLocaleString()}`;
    if (elPaid) elPaid.textContent = `KES ${paidRevenue.toLocaleString()}`;
    if (elPending) elPending.textContent = `KES ${pendingRevenue.toLocaleString()}`;
    if (elUnmatched) elUnmatched.textContent = `${unmatchedCount} Action Needed`;
  }

  // --- Zoho-Style Invoicing Engine ---
  populateInvoiceFormSelects() {
    const custSelect = document.getElementById("invoice-customer-select");
    if (!custSelect) return;

    const currentVal = custSelect.value;
    custSelect.innerHTML = `<option value="">-- Select Customer --</option>` +
      window.appState.state.customers.map(c => `
        <option value="${c.id}">${c.name} (${c.estate} - ${c.phone})</option>
      `).join("");

    if (currentVal) custSelect.value = currentVal;
  }

  onCustomerSelectChange(customerId) {
    const cust = window.appState.state.customers.find(c => c.id === customerId);
    if (!cust) return;

    const emailEl = document.getElementById("inv-field-email");
    const phoneEl = document.getElementById("inv-field-phone");
    const addressEl = document.getElementById("inv-field-address");
    const bagTypeSelect = document.getElementById("inv-field-bag-type");
    const bagQtyInput = document.getElementById("inv-field-bag-qty");
    const monthsSelect = document.getElementById("inv-field-months");
    const rateInput = document.getElementById("inv-field-rate");

    if (emailEl) emailEl.value = cust.email || "";
    if (phoneEl) phoneEl.value = cust.phone || "";
    if (addressEl) addressEl.value = cust.estate || "";
    if (bagTypeSelect) bagTypeSelect.value = cust.bagType || "green";
    if (bagQtyInput) bagQtyInput.value = cust.bagQty || 8;
    if (monthsSelect) monthsSelect.value = cust.subscriptionMonths || 3;
    if (rateInput) rateInput.value = cust.monthlyRate || 1500;

    this.recalculateInvoiceTotals();
  }

  recalculateInvoiceTotals() {
    const rateInput = document.getElementById("inv-field-rate");
    const monthsSelect = document.getElementById("inv-field-months");
    const discountInput = document.getElementById("inv-field-discount");
    const vatCheckbox = document.getElementById("inv-field-vat");

    const rate = Number(rateInput ? rateInput.value : 1500) || 0;
    const months = Number(monthsSelect ? monthsSelect.value : 3) || 3;
    const discount = Number(discountInput ? discountInput.value : 0) || 0;
    const applyVat = vatCheckbox ? vatCheckbox.checked : false;

    const subtotal = rate * months;
    const discounted = Math.max(0, subtotal - discount);
    const vat = applyVat ? Math.round(discounted * 0.16) : 0;
    const total = discounted + vat;

    const subtotalSpan = document.getElementById("inv-calc-subtotal");
    const vatSpan = document.getElementById("inv-calc-vat");
    const totalSpan = document.getElementById("inv-calc-total");

    if (subtotalSpan) subtotalSpan.textContent = `KES ${subtotal.toLocaleString()}`;
    if (vatSpan) vatSpan.textContent = `KES ${vat.toLocaleString()}`;
    if (totalSpan) totalSpan.textContent = `KES ${total.toLocaleString()}`;

    return { subtotal, discount, vat, total, months, rate };
  }

  saveInvoice(sendToClient = true) {
    const custSelect = document.getElementById("invoice-customer-select");
    const customerId = custSelect ? custSelect.value : "";
    const cust = window.appState.state.customers.find(c => c.id === customerId);

    if (!cust) {
      window.app.showToast("Select Customer", "Please select a customer before saving the invoice.", "error");
      return;
    }

    const totals = this.recalculateInvoiceTotals();
    const bagTypeSelect = document.getElementById("inv-field-bag-type");
    const bagQtyInput = document.getElementById("inv-field-bag-qty");
    const notesInput = document.getElementById("inv-field-notes");
    const dueDateInput = document.getElementById("inv-field-due-date");

    const bagObj = window.appState.state.bagTiers.find(b => b.id === (bagTypeSelect ? bagTypeSelect.value : "green"));
    const bagTypeName = bagObj ? bagObj.name : "Green Organic Bag";

    const invoice = window.appState.createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email,
      customerAddress: cust.estate,
      dueDate: dueDateInput ? dueDateInput.value : new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      period: `${totals.months} Months Collection Plan`,
      bagType: bagTypeName,
      bagQty: Number(bagQtyInput ? bagQtyInput.value : 8),
      subscriptionMonths: totals.months,
      ratePerMonth: totals.rate,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.vat,
      total: totals.total,
      status: "Pending",
      notes: notesInput ? notesInput.value : "Twice-weekly scheduled residential collection."
    });

    this.closeInvoiceModal();
    window.app.showToast("Invoice Created!", `Invoice ${invoice.id} generated for ${cust.name}.`, "success");

    if (sendToClient) {
      // Simulate WhatsApp & SMS notification dispatch
      window.CrownBinsDocGenerator.shareToWhatsApp(invoice);
    }
  }

  openInvoiceModal() {
    const modal = document.getElementById("admin-invoice-modal");
    if (modal) {
      modal.classList.add("open");
      const numSpan = document.getElementById("new-inv-number-display");
      if (numSpan) {
        numSpan.textContent = `INV-2026-${String(window.appState.state.invoices.length + 843).padStart(4, '0')}`;
      }
      const dueDateInput = document.getElementById("inv-field-due-date");
      if (dueDateInput) {
        dueDateInput.value = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      }
    }
  }

  closeInvoiceModal() {
    const modal = document.getElementById("admin-invoice-modal");
    if (modal) modal.classList.remove("open");
  }

  // --- Reconciliation Queue ---
  renderReconciliationQueue(unmatchedList) {
    const tbody = document.getElementById("admin-reconciliation-tbody");
    if (!tbody) return;

    if (unmatchedList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No unmatched transactions. All payments reconciled!</td></tr>`;
      return;
    }

    tbody.innerHTML = unmatchedList.map(item => `
      <tr>
        <td><strong style="font-family:monospace; color:#15803d;">${item.transactionCode}</strong></td>
        <td>${item.channel}</td>
        <td><strong>${item.senderName}</strong><br><small class="text-muted">${item.senderPhone}</small></td>
        <td><strong>KES ${item.amount.toLocaleString()}</strong></td>
        <td>${item.dateTime}</td>
        <td><span class="badge badge-warning">${item.suspectedCustomer || 'Unlinked'}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="window.adminPortal.openLinkPaymentModal('${item.id}')">
            Match & Link
          </button>
        </td>
      </tr>
    `).join("");
  }

  openLinkPaymentModal(paymentId) {
    const payment = window.appState.state.unmatchedPayments.find(p => p.id === paymentId);
    if (!payment) return;

    this.activeReconcilingPayment = payment;
    const modal = document.getElementById("link-payment-modal");
    const codeSpan = document.getElementById("link-pay-code");
    const amountSpan = document.getElementById("link-pay-amount");
    const senderSpan = document.getElementById("link-pay-sender");
    const selectEl = document.getElementById("link-pay-customer-select");

    if (codeSpan) codeSpan.textContent = payment.transactionCode;
    if (amountSpan) amountSpan.textContent = `KES ${payment.amount.toLocaleString()}`;
    if (senderSpan) senderSpan.textContent = `${payment.senderName} (${payment.senderPhone})`;

    if (selectEl) {
      selectEl.innerHTML = `<option value="">-- Choose Matching Customer Account --</option>` +
        window.appState.state.customers.map(c => `
          <option value="${c.id}">${c.name} - Outstanding: KES ${(c.currentBalance || 0).toLocaleString()} (${c.estate})</option>
        `).join("");
    }

    if (modal) modal.classList.add("open");
  }

  confirmPaymentLink() {
    if (!this.activeReconcilingPayment) return;
    const selectEl = document.getElementById("link-pay-customer-select");
    const customerId = selectEl ? selectEl.value : "";

    if (!customerId) {
      window.app.showToast("Select Customer", "Please select a customer account to link this payment.", "error");
      return;
    }

    window.appState.matchUnmatchedPayment(this.activeReconcilingPayment.id, customerId);
    this.closeLinkPaymentModal();
    window.app.showToast("Payment Reconciled", `Payment linked and receipt automatically generated.`, "success");
  }

  closeLinkPaymentModal() {
    const modal = document.getElementById("link-payment-modal");
    if (modal) modal.classList.remove("open");
  }

  // --- Truck & Route Dispatch ---
  renderTruckDispatch(areas, trucks) {
    const tbody = document.getElementById("admin-truck-routes-tbody");
    if (!tbody) return;

    tbody.innerHTML = areas.map(area => `
      <tr>
        <td><strong>${area.name}</strong></td>
        <td>${area.county}</td>
        <td><span class="badge ${area.status === 'Active' ? 'badge-success' : 'badge-warning'}">${area.status}</span></td>
        <td>${area.days}</td>
        <td>
          <select class="form-select form-select-sm" onchange="window.adminPortal.onTruckAssignChange(${area.id}, this.value)">
            ${trucks.map(t => `<option value="${t.id}" ${area.truck === t.name ? 'selected' : ''}>${t.name} - ${t.driver}</option>`).join("")}
          </select>
        </td>
      </tr>
    `).join("");
  }

  onTruckAssignChange(areaId, truckId) {
    window.appState.assignTruckToRoute(Number(areaId), truckId);
    window.app.showToast("Route Updated", "Truck assignment saved for collection team.", "success");
  }

  // --- Customer Master Directory ---
  renderCustomerDirectory(customers) {
    const tbody = document.getElementById("admin-customers-tbody");
    if (!tbody) return;

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td><strong>${c.name}</strong><br><small class="text-muted">${c.email}</small></td>
        <td>${c.phone}</td>
        <td>${c.estate}</td>
        <td><span class="bag-pill bag-pill-${c.bagType}">${c.bagQty} ${c.bagType.toUpperCase()}</span></td>
        <td>${c.subscriptionMonths} Months</td>
        <td><strong>KES ${(c.currentBalance || 0).toLocaleString()}</strong></td>
        <td>
          <span class="badge ${c.currentBalance === 0 ? 'badge-success' : (c.accountStatus.includes('Overdue') ? 'badge-danger' : 'badge-warning')}">
            ${c.currentBalance === 0 ? 'Paid' : c.accountStatus}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.adminPortal.quickInvoiceForCustomer('${c.id}')">Invoice</button>
        </td>
      </tr>
    `).join("");
  }

  quickInvoiceForCustomer(customerId) {
    this.openInvoiceModal();
    const select = document.getElementById("invoice-customer-select");
    if (select) {
      select.value = customerId;
      this.onCustomerSelectChange(customerId);
    }
  }

  // --- Complaints Management ---
  renderComplaintsManager(complaints) {
    const tbody = document.getElementById("admin-complaints-tbody");
    if (!tbody) return;

    tbody.innerHTML = complaints.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.customerName}</td>
        <td><span class="badge badge-info">${c.category}</span></td>
        <td><strong>${c.subject}</strong><br><small>${c.details}</small></td>
        <td>${c.date}</td>
        <td>
          <span class="badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
        </td>
        <td>
          ${c.status !== 'Resolved' ? `
            <button class="btn btn-sm btn-primary" onclick="window.adminPortal.resolveComplaintPrompt('${c.id}')">Resolve</button>
          ` : `<span class="text-muted text-sm">Completed</span>`}
        </td>
      </tr>
    `).join("");
  }

  resolveComplaintPrompt(id) {
    const note = prompt("Enter resolution notes for customer (e.g. 'Driver completed pickup at 4:00 PM'):");
    if (note) {
      window.appState.updateComplaintStatus(id, "Resolved", note, "Admin Desk");
      window.app.showToast("Complaint Resolved", `Customer notification dispatched.`, "success");
    }
  }

  // --- Recent Invoices Table ---
  renderRecentInvoicesTable(invoices) {
    const tbody = document.getElementById("admin-recent-invoices-tbody");
    if (!tbody) return;

    tbody.innerHTML = invoices.slice(0, 10).map(inv => {
      const isPaid = inv.status === "Paid";
      return `
        <tr>
          <td><strong>${inv.id}</strong></td>
          <td>${inv.customerName}</td>
          <td>${inv.date}</td>
          <td>${inv.dueDate}</td>
          <td><strong>KES ${inv.total.toLocaleString()}</strong></td>
          <td><span class="badge ${isPaid ? 'badge-success' : (inv.status === 'Overdue' ? 'badge-danger' : 'badge-warning')}">${inv.status}</span></td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="window.CrownBinsDocGenerator.openDocumentInNewTab(window.appState.state.invoices.find(i=>i.id==='${inv.id}'))">PDF</button>
            <button class="btn btn-sm btn-ghost" onclick="window.CrownBinsDocGenerator.shareToWhatsApp(window.appState.state.invoices.find(i=>i.id==='${inv.id}'))">WhatsApp</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- Audit Logs ---
  renderAuditLogs(logs) {
    const container = document.getElementById("admin-audit-logs-container");
    if (!container) return;

    container.innerHTML = logs.map(log => `
      <div class="audit-log-row">
        <span class="audit-time">${log.timestamp}</span>
        <span class="audit-user">[${log.user}]</span>
        <span class="audit-action">${log.action}</span>
      </div>
    `).join("");
  }

  // --- CMS Content & Service Areas ---
  renderServiceAreasCMS(areas) {
    const container = document.getElementById("cms-service-areas-list");
    if (!container) return;

    container.innerHTML = areas.map(a => `
      <div class="cms-area-pill">
        <strong>${a.name}</strong> (${a.county})
        <span class="badge ${a.status === 'Active' ? 'badge-success' : 'badge-warning'}">${a.status}</span>
      </div>
    `).join("");
  }

  // --- Data Migration (CSV Import / Export) ---
  exportCSV() {
    const csvData = window.appState.exportCustomersCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CrownBins_Customers_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.app.showToast("Export Successful", "Customer records exported to CSV for Zoho One.", "success");
  }

  handleCSVUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const count = window.appState.importCustomersCSV(e.target.result);
      window.app.showToast("Import Complete", `Successfully imported ${count} customers.`, "success");
    };
    reader.readAsText(file);
  }

  switchTab(tabId) {
    document.querySelectorAll(".admin-nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabId);
    });
    document.querySelectorAll(".admin-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `admin-tab-${tabId}`);
    });
  }
}

window.adminPortal = new AdminPortal();
