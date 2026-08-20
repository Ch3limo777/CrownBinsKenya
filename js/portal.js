/**
 * CrownBins Solutions Kenya - Customer Portal Controller
 * Manages customer dashboard, payments (STK Push, Till, Paybill), invoices, and complaints
 */

class CustomerPortal {
  constructor() {
    this.init();
  }

  init() {
    // Listen for state changes to refresh customer portal UI
    window.appState.subscribe(() => {
      if (window.appState.state.currentRole === "customer") {
        this.render();
      }
    });
  }

  render() {
    const customer = window.appState.getCurrentCustomer();
    const invoices = window.appState.state.invoices.filter(i => i.customerId === customer.id);
    const complaints = window.appState.state.complaints.filter(c => c.customerId === customer.id);
    const pendingInvoice = invoices.find(i => i.status !== "Paid");

    // Populate Overview
    const custNameEl = document.getElementById("portal-cust-name");
    const custPlanBadgeEl = document.getElementById("portal-cust-plan-badge");
    const balanceEl = document.getElementById("portal-balance-amount");
    const nextDateEl = document.getElementById("portal-next-collection");
    const bagTypeEl = document.getElementById("portal-bag-type");
    const bagQtyEl = document.getElementById("portal-bag-qty");
    const statusPillEl = document.getElementById("portal-account-status");

    if (custNameEl) custNameEl.textContent = customer.name;
    if (custPlanBadgeEl) custPlanBadgeEl.textContent = `${customer.type} • ${customer.subscriptionMonths}-Month Plan`;
    if (balanceEl) balanceEl.textContent = `KES ${(customer.currentBalance || 0).toLocaleString()}`;
    if (nextDateEl) nextDateEl.textContent = customer.nextCollectionDate || "Every Tuesday & Friday";
    if (bagTypeEl) {
      const bagObj = window.appState.state.bagTiers.find(b => b.id === customer.bagType) || window.appState.state.bagTiers[0];
      bagTypeEl.innerHTML = `<span class="bag-dot" style="background-color: ${bagObj.color}"></span> ${bagObj.name}`;
    }
    if (bagQtyEl) bagQtyEl.textContent = `${customer.bagQty} Bags/Month (${customer.frequency || '2x Weekly'})`;
    if (statusPillEl) {
      statusPillEl.textContent = customer.accountStatus || "Active";
      statusPillEl.className = `status-pill ${customer.currentBalance > 0 ? 'status-pill-warning' : 'status-pill-success'}`;
    }

    // Render Current Bill
    this.renderCurrentBill(pendingInvoice, customer);

    // Render Invoices Table
    this.renderInvoicesTable(invoices);

    // Render Complaints List
    this.renderComplaintsList(complaints);

    // Render Schedule Tab
    this.renderScheduleTab(customer);
  }

  renderCurrentBill(invoice, customer) {
    const billCard = document.getElementById("portal-current-bill-card");
    if (!billCard) return;

    if (!invoice) {
      billCard.innerHTML = `
        <div class="card-empty-state">
          <div class="empty-icon success">✓</div>
          <h3>Your Account is All Paid Up!</h3>
          <p>You have no outstanding invoices. Your waste collection service is fully active for this cycle.</p>
          <div class="empty-actions">
            <button class="btn btn-outline" onclick="window.customerPortal.openSpecialPickupModal()">Request Extra Pickup</button>
            <button class="btn btn-primary" onclick="window.customerPortal.switchTab('invoices')">View Past Receipts</button>
          </div>
        </div>
      `;
      return;
    }

    billCard.innerHTML = `
      <div class="current-bill-header">
        <div>
          <span class="badge badge-warning">Payment Due</span>
          <h3 class="bill-title">Invoice #${invoice.id}</h3>
          <p class="bill-period">Period: <strong>${invoice.period}</strong></p>
        </div>
        <div class="bill-amount-block">
          <span class="amount-label">Total Due</span>
          <span class="amount-val">KES ${invoice.total.toLocaleString()}</span>
          <span class="due-date">Due: ${invoice.dueDate}</span>
        </div>
      </div>

      <div class="bill-details-grid">
        <div class="detail-item">
          <span class="d-label">Service Type</span>
          <span class="d-val">${customer.type}</span>
        </div>
        <div class="detail-item">
          <span class="d-label">Bags Allocated</span>
          <span class="d-val">${invoice.bagQty} ${invoice.bagType}</span>
        </div>
        <div class="detail-item">
          <span class="d-label">Billing Cycle</span>
          <span class="d-val">${invoice.subscriptionMonths} Months</span>
        </div>
        <div class="detail-item">
          <span class="d-label">Estate / Address</span>
          <span class="d-val">${customer.estate}</span>
        </div>
      </div>

      <div class="bill-actions-row">
        <button class="btn btn-primary btn-lg" onclick="window.customerPortal.openPaymentModal('${invoice.id}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Pay Now (M-Pesa / Bank)
        </button>
        <button class="btn btn-outline" onclick="window.CrownBinsDocGenerator.openDocumentInNewTab(window.appState.state.invoices.find(i=>i.id==='${invoice.id}'))">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          View PDF Invoice
        </button>
      </div>
    `;
  }

  renderInvoicesTable(invoices) {
    const tableBody = document.getElementById("portal-invoices-tbody");
    if (!tableBody) return;

    if (invoices.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No billing records found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = invoices.map(inv => {
      const isPaid = inv.status === "Paid";
      const statusClass = isPaid ? "badge-success" : (inv.status === "Overdue" ? "badge-danger" : "badge-warning");

      return `
        <tr>
          <td><strong>${inv.id}</strong></td>
          <td>${inv.date}</td>
          <td>${inv.period}</td>
          <td>KES ${inv.total.toLocaleString()}</td>
          <td><span class="badge ${statusClass}">${inv.status}</span></td>
          <td>
            <small style="font-family: monospace; font-weight: 600; color: #15803d;">
              ${inv.transactionCode || (isPaid ? 'PAID' : 'PENDING')}
            </small>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-outline" title="Download Official Document" onclick="window.CrownBinsDocGenerator.openDocumentInNewTab(window.appState.state.invoices.find(i=>i.id==='${inv.id}'))">
                PDF
              </button>
              <button class="btn btn-sm btn-ghost" title="Send to WhatsApp" onclick="window.CrownBinsDocGenerator.shareToWhatsApp(window.appState.state.invoices.find(i=>i.id==='${inv.id}'))">
                WhatsApp
              </button>
              ${!isPaid ? `
                <button class="btn btn-sm btn-primary" onclick="window.customerPortal.openPaymentModal('${inv.id}')">
                  Pay
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  renderComplaintsList(complaints) {
    const container = document.getElementById("portal-complaints-list");
    if (!container) return;

    if (complaints.length === 0) {
      container.innerHTML = `
        <div class="card-empty-state">
          <p>No active complaints or service tickets.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = complaints.map(c => {
      const statusBadge = c.status === "Resolved" ? "badge-success" : "badge-warning";
      return `
        <div class="complaint-card">
          <div class="complaint-header">
            <div>
              <span class="badge ${statusBadge}">${c.status}</span>
              <span class="complaint-id">${c.id}</span>
              <span class="complaint-cat">${c.category}</span>
            </div>
            <span class="complaint-date">${c.date}</span>
          </div>
          <h4 class="complaint-title">${c.subject}</h4>
          <p class="complaint-body">${c.details}</p>
          ${c.resolution ? `
            <div class="complaint-resolution">
              <strong>Resolution / Update:</strong> ${c.resolution}
              <div class="assigned-tag">Handled by: ${c.assignedTo}</div>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  }

  renderScheduleTab(customer) {
    const schedContainer = document.getElementById("portal-schedule-container");
    if (!schedContainer) return;

    schedContainer.innerHTML = `
      <div class="schedule-grid">
        <div class="schedule-card highlight">
          <div class="sched-icon">🚛</div>
          <h3>Next Regular Collection</h3>
          <div class="sched-big-date">${customer.nextCollectionDate || 'Friday, 21 Aug 2026'}</div>
          <p class="sched-note">Please ensure your <strong>${customer.bagType.toUpperCase()} bags</strong> are tied and placed outside before <strong>07:30 AM</strong>.</p>
          <div class="sched-status-badge">Assigned Truck: Truck 01 (Isuzu NPR)</div>
        </div>

        <div class="schedule-card">
          <h3>Your Weekly Schedule</h3>
          <ul class="sched-days-list">
            <li class="active-day">
              <span class="day-dot"></span>
              <strong>Tuesday Morning:</strong> General & Domestic Waste Pickup (07:30 AM - 10:30 AM)
            </li>
            <li class="active-day">
              <span class="day-dot"></span>
              <strong>Friday Morning:</strong> Recyclables & Yard Waste Pickup (07:30 AM - 10:30 AM)
            </li>
          </ul>
          <div style="margin-top: 20px;">
            <button class="btn btn-outline btn-block" onclick="window.customerPortal.openSpecialPickupModal()">Request Special / Extra Bags Pickup</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Modals and Interactions ---
  openPaymentModal(invoiceId) {
    const inv = window.appState.state.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    this.activePayingInvoice = inv;
    const modal = document.getElementById("payment-modal");
    const amountSpan = document.getElementById("modal-pay-amount");
    const invSpan = document.getElementById("modal-pay-inv-id");
    const phoneInput = document.getElementById("stk-phone-input");

    if (amountSpan) amountSpan.textContent = `KES ${inv.total.toLocaleString()}`;
    if (invSpan) invSpan.textContent = inv.id;
    if (phoneInput) {
      const cust = window.appState.getCurrentCustomer();
      phoneInput.value = cust.phone.replace(/[^0-9]/g, '').slice(-9); // 722849102
    }

    if (modal) {
      modal.classList.add("open");
      this.selectPaymentTab('stk');
    }
  }

  closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) modal.classList.remove("open");
  }

  selectPaymentTab(tabId) {
    document.querySelectorAll(".pay-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    document.querySelectorAll(".pay-tab-content").forEach(c => {
      c.classList.toggle("active", c.id === `pay-content-${tabId}`);
    });
  }

  // Simulate Safaricom STK Push
  triggerSTKPush() {
    const inv = this.activePayingInvoice;
    if (!inv) return;

    const phoneInput = document.getElementById("stk-phone-input");
    const phoneNum = "0" + (phoneInput ? phoneInput.value.trim() : "722000000");

    const btn = document.getElementById("btn-trigger-stk");
    const statusDiv = document.getElementById("stk-status-indicator");

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Sending M-Pesa STK Push...`;
    }

    if (statusDiv) {
      statusDiv.innerHTML = `
        <div class="stk-prompt-box">
          <div class="phone-graphic">📱</div>
          <h4>M-Pesa Prompt Sent!</h4>
          <p>Please check your phone (<strong>${phoneNum}</strong>) and enter your M-Pesa PIN to complete payment of <strong>KES ${inv.total.toLocaleString()}</strong> to CrownBins Solutions Kenya.</p>
          <div class="countdown-bar"><div class="countdown-fill"></div></div>
        </div>
      `;
      statusDiv.style.display = "block";
    }

    // Simulate phone response after 3 seconds
    setTimeout(() => {
      const sampleCodes = ["QHK98210LA", "QHK74129KM", "QHL19283KB", "QHL83912NM"];
      const code = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];

      window.appState.payInvoice(inv.id, "Safaricom M-Pesa (STK Push)", code);

      if (statusDiv) {
        statusDiv.innerHTML = `
          <div class="stk-success-box">
            <div class="success-icon">✓</div>
            <h4>Payment Received & Confirmed!</h4>
            <p>M-Pesa Transaction Code: <strong>${code}</strong></p>
            <p>Your receipt has been generated automatically and dispatched to your WhatsApp.</p>
            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
              <button class="btn btn-primary btn-sm" onclick="window.CrownBinsDocGenerator.openDocumentInNewTab(window.appState.state.invoices.find(i=>i.id==='${inv.id}'))">View Receipt (PDF)</button>
              <button class="btn btn-outline btn-sm" onclick="window.customerPortal.closePaymentModal()">Done</button>
            </div>
          </div>
        `;
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Payment Completed`;
      }

      window.app.showToast("Payment Successful!", `Receipt for ${inv.id} has been generated.`, "success");
    }, 3200);
  }

  // Submit Manual Transaction Code (Paybill / Till / Bank)
  submitManualCode(methodName) {
    const inv = this.activePayingInvoice;
    const inputEl = document.getElementById(methodName === 'paybill' ? 'paybill-code-input' : (methodName === 'till' ? 'till-code-input' : 'bank-code-input'));
    const code = inputEl ? inputEl.value.trim().toUpperCase() : "";

    if (!code || code.length < 5) {
      window.app.showToast("Invalid Reference", "Please enter a valid M-Pesa transaction code or bank reference.", "error");
      return;
    }

    const customer = window.appState.getCurrentCustomer();
    
    // Check if code matches an expected standard or auto-reconciles
    window.appState.addManualMpesaCodeSubmission(customer.id, code, inv.total, `Manual ${methodName.toUpperCase()}`);
    
    // Auto-match for immediate gratification in demo or place in queue
    window.appState.payInvoice(inv.id, `Manual Submission (${methodName.toUpperCase()})`, code);

    this.closePaymentModal();
    window.app.showToast("Transaction Submitted", `Code ${code} verified. Receipt ready!`, "success");
  }

  openComplaintModal() {
    const modal = document.getElementById("complaint-modal");
    if (modal) modal.classList.add("open");
  }

  closeComplaintModal() {
    const modal = document.getElementById("complaint-modal");
    if (modal) modal.classList.remove("open");
  }

  submitComplaintForm(e) {
    if (e) e.preventDefault();
    const category = document.getElementById("complaint-category-select").value;
    const subject = document.getElementById("complaint-subject-input").value.trim();
    const details = document.getElementById("complaint-details-input").value.trim();

    if (!subject || !details) {
      window.app.showToast("Missing Information", "Please enter the subject and details.", "error");
      return;
    }

    const cust = window.appState.getCurrentCustomer();
    window.appState.raiseComplaint({
      customerId: cust.id,
      customerName: cust.name,
      category: category,
      subject: subject,
      details: details
    });

    this.closeComplaintModal();
    window.app.showToast("Ticket Created", "CrownBins Operations team will respond shortly.", "success");
  }

  openSpecialPickupModal() {
    const modal = document.getElementById("special-pickup-modal");
    if (modal) modal.classList.add("open");
  }

  closeSpecialPickupModal() {
    const modal = document.getElementById("special-pickup-modal");
    if (modal) modal.classList.remove("open");
  }

  submitSpecialPickup(e) {
    if (e) e.preventDefault();
    const date = document.getElementById("pickup-date-input").value;
    const extraBags = document.getElementById("pickup-bags-input").value;
    const notes = document.getElementById("pickup-notes-input").value;

    const cust = window.appState.getCurrentCustomer();
    window.appState.raiseComplaint({
      customerId: cust.id,
      customerName: cust.name,
      category: "Special Pickup Request",
      subject: `Special collection for ${extraBags} extra bags on ${date}`,
      details: `Customer requested extra bags pickup on ${date}. Notes: ${notes || 'None'}`
    });

    this.closeSpecialPickupModal();
    window.app.showToast("Pickup Scheduled", `Special pickup request received for ${date}.`, "success");
  }

  switchTab(tabId) {
    document.querySelectorAll(".portal-nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabId);
    });
    document.querySelectorAll(".portal-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `portal-tab-${tabId}`);
    });
  }
}

window.customerPortal = new CustomerPortal();
