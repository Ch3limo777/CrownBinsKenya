/**
 * CrownBins Solutions Kenya - Main Application Controller
 * Handles Public Website, Navigation, Quote Calculator, Hero Carousel, Role Switching & Toasts
 */

class CrownBinsApp {
  constructor() {
    this.currentHeroSlide = 0;
    this.heroInterval = null;
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupNavigation();
      this.setupHeroCarousel();
      this.setupServiceAreaChecker();
      this.setupQuoteEstimator();
      this.setupMissedPickupForm();
      this.setupRoleSwitcher();
      this.setupEventListeners();

      // Initial state sync
      this.syncUIWithRole(window.appState.state.currentRole);
      window.appState.subscribe(state => {
        this.syncUIWithRole(state.currentRole);
      });
    });
  }

  // --- Role Switcher & View Toggling ---
  setupRoleSwitcher() {
    const roleSelect = document.getElementById("global-role-switcher");
    if (roleSelect) {
      roleSelect.value = window.appState.state.currentRole;
      roleSelect.addEventListener("change", (e) => {
        const newRole = e.target.value;
        window.appState.setRole(newRole);
        this.showToast("Role Switched", `Now viewing as ${newRole.replace('_', ' ').toUpperCase()}`, "info");
      });
    }
  }

  setRoleDirectly(role, customerId = "CUST-001") {
    const roleSelect = document.getElementById("global-role-switcher");
    if (roleSelect) roleSelect.value = role;
    window.appState.setRole(role, customerId);
    this.showToast("Access Granted", `Switched to ${role.toUpperCase()} mode.`, "info");
    
    // Scroll smoothly to relevant view
    if (role === "visitor") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetView = document.getElementById(role === "customer" ? "customer-portal-view" : "admin-portal-view");
      if (targetView) targetView.scrollIntoView({ behavior: "smooth" });
    }
  }

  syncUIWithRole(role) {
    const publicView = document.getElementById("public-website-view");
    const customerView = document.getElementById("customer-portal-view");
    const adminView = document.getElementById("admin-portal-view");
    const roleBadge = document.getElementById("active-role-badge");

    if (roleBadge) {
      roleBadge.textContent = role.toUpperCase().replace('_', ' ');
      roleBadge.className = `role-pill role-pill-${role}`;
    }

    if (publicView) publicView.style.display = (role === "visitor") ? "block" : "none";
    if (customerView) customerView.style.display = (role === "customer") ? "block" : "none";
    if (adminView) adminView.style.display = (role === "admin" || role === "super_admin") ? "block" : "none";

    if (role === "customer" && window.customerPortal) {
      window.customerPortal.render();
    } else if ((role === "admin" || role === "super_admin") && window.adminPortal) {
      window.adminPortal.render();
    }
  }

  // --- Hero Slider / Carousel ---
  setupHeroCarousel() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    if (slides.length === 0) return;

    this.showSlide = (index) => {
      slides.forEach((s, i) => s.classList.toggle("active", i === index));
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
      this.currentHeroSlide = index;
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        this.showSlide(idx);
        this.resetHeroTimer();
      });
    });

    const nextBtn = document.getElementById("hero-next");
    const prevBtn = document.getElementById("hero-prev");
    if (nextBtn) nextBtn.addEventListener("click", () => {
      this.showSlide((this.currentHeroSlide + 1) % slides.length);
      this.resetHeroTimer();
    });
    if (prevBtn) prevBtn.addEventListener("click", () => {
      this.showSlide((this.currentHeroSlide - 1 + slides.length) % slides.length);
      this.resetHeroTimer();
    });

    this.resetHeroTimer();
  }

  resetHeroTimer() {
    if (this.heroInterval) clearInterval(this.heroInterval);
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length > 1) {
      this.heroInterval = setInterval(() => {
        this.showSlide((this.currentHeroSlide + 1) % slides.length);
      }, 5500);
    }
  }

  // --- Service Area Coverage Checker ---
  setupServiceAreaChecker() {
    const input = document.getElementById("area-search-input");
    const resultDiv = document.getElementById("area-search-results");
    const areasGrid = document.getElementById("service-areas-grid");

    // Render initial grid of areas
    if (areasGrid) {
      const areas = window.appState.state.serviceAreas;
      areasGrid.innerHTML = areas.map(a => `
        <div class="area-card ${a.status === 'Active' ? 'active-zone' : 'expansion-zone'}">
          <div class="area-card-header">
            <span class="county-tag">${a.county}</span>
            <span class="status-tag ${a.status === 'Active' ? 'active' : 'upcoming'}">${a.status}</span>
          </div>
          <h4>${a.name}</h4>
          <p class="area-days">📅 ${a.days}</p>
          <p class="area-truck">🚛 Assigned: ${a.truck || 'Allocating Route'}</p>
        </div>
      `).join("");
    }

    if (input && resultDiv) {
      input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          resultDiv.innerHTML = "";
          resultDiv.style.display = "none";
          return;
        }

        const matches = window.appState.state.serviceAreas.filter(a => 
          a.name.toLowerCase().includes(query) || a.county.toLowerCase().includes(query)
        );

        resultDiv.style.display = "block";
        if (matches.length > 0) {
          resultDiv.innerHTML = matches.map(m => `
            <div class="area-result-item ${m.status === 'Active' ? 'served' : 'pending'}">
              <div>
                <strong>${m.name}</strong> (${m.county} County)
                <div class="schedule-sub">${m.days}</div>
              </div>
              <span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-warning'}">${m.status}</span>
            </div>
          `).join("");
        } else {
          resultDiv.innerHTML = `
            <div class="area-result-item none">
              <div>
                <strong>“${e.target.value}” is currently in our expansion queue.</strong>
                <div class="schedule-sub">We are adding new estates weekly!</div>
              </div>
              <button class="btn btn-sm btn-primary" onclick="window.app.openExpansionVoteModal('${e.target.value}')">Request Coverage</button>
            </div>
          `;
        }
      });
    }
  }

  // --- Quote Estimator with WhatsApp Deep-Link ---
  setupQuoteEstimator() {
    const bagSelect = document.getElementById("quote-bag-type");
    const qtySelect = document.getElementById("quote-bag-qty");
    const planSelect = document.getElementById("quote-plan");
    const areaInput = document.getElementById("quote-location");
    const estimateSpan = document.getElementById("quote-estimated-price");
    const whatsappBtn = document.getElementById("quote-whatsapp-btn");

    const updateQuote = () => {
      const bagId = bagSelect ? bagSelect.value : "green";
      const qty = Number(qtySelect ? qtySelect.value : 8);
      const months = Number(planSelect ? planSelect.value : 3);
      const location = areaInput ? areaInput.value.trim() : "Nairobi";

      const bag = window.appState.state.bagTiers.find(b => b.id === bagId) || window.appState.state.bagTiers[0];
      
      // Calculate guideline range based on base rate and bag volume
      const baseMonthly = (bag.baseRatePerMonth / 8) * qty;
      const discountMult = months === 6 ? 0.90 : (months === 4 ? 0.95 : 1.0);
      const minEstimatedTotal = Math.round(baseMonthly * months * 0.9 * discountMult);
      const maxEstimatedTotal = Math.round(baseMonthly * months * 1.15 * discountMult);

      if (estimateSpan) {
        estimateSpan.textContent = `KES ${minEstimatedTotal.toLocaleString()} - ${maxEstimatedTotal.toLocaleString()} for ${months} Months`;
      }

      if (whatsappBtn) {
        const msg = `Hello CrownBins Kenya! 👋 I would like a quote for garbage collection service:\n- Bag Type: ${bag.name}\n- Quantity: ${qty} bags/month\n- Frequency: ${qty === 4 ? 'Once weekly' : 'Twice weekly'}\n- Billing Plan: ${months} Months\n- My Location/Estate: ${location || 'Nairobi'}\n\nPlease let me know your best pricing.`;
        whatsappBtn.href = `https://api.whatsapp.com/send?phone=254712345678&text=${encodeURIComponent(msg)}`;
      }
    };

    [bagSelect, qtySelect, planSelect, areaInput].forEach(el => {
      if (el) el.addEventListener("input", updateQuote);
    });

    updateQuote();
  }

  // --- Missed Pickup Fast Reporter ---
  setupMissedPickupForm() {
    const form = document.getElementById("missed-pickup-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("mp-name").value.trim();
      const phone = document.getElementById("mp-phone").value.trim();
      const estate = document.getElementById("mp-estate").value.trim();
      const notes = document.getElementById("mp-notes").value.trim();

      const complaint = window.appState.raiseComplaint({
        customerId: "GUEST-PUBLIC",
        customerName: name,
        category: "Missed Pickup (Urgent)",
        subject: `Missed collection reported at ${estate}`,
        details: `Customer Phone: ${phone}. Location: ${estate}. Notes: ${notes || 'Standard bags awaiting pickup.'}`
      });

      form.reset();
      this.showToast("Report Submitted!", `Ticket #${complaint.id} logged. Our dispatch team is re-routing a truck.`, "success");
    });
  }

  // --- Navigation & Modals ---
  setupNavigation() {
    const navToggle = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("nav-links-menu");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
      });
    }

    // Smooth scroll anchors
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (navLinks) navLinks.classList.remove("open");
          }
        }
      });
    });
  }

  setupEventListeners() {
    // Referral button copy
    const refBtn = document.getElementById("btn-copy-referral");
    if (refBtn) {
      refBtn.addEventListener("click", () => {
        const codeInput = document.getElementById("referral-code-input");
        if (codeInput) {
          navigator.clipboard.writeText(codeInput.value);
          this.showToast("Referral Link Copied!", "Share with neighbors to earn free collection months.", "success");
        }
      });
    }
  }

  openQuoteModal() {
    const modal = document.getElementById("quote-modal");
    if (modal) modal.classList.add("open");
  }

  closeQuoteModal() {
    const modal = document.getElementById("quote-modal");
    if (modal) modal.classList.remove("open");
  }

  openExpansionVoteModal(areaName = "") {
    const modal = document.getElementById("expansion-modal");
    const nameInput = document.getElementById("expansion-area-name");
    if (nameInput && areaName) nameInput.value = areaName;
    if (modal) modal.classList.add("open");
  }

  closeExpansionVoteModal() {
    const modal = document.getElementById("expansion-modal");
    if (modal) modal.classList.remove("open");
  }

  submitExpansionRequest(e) {
    if (e) e.preventDefault();
    const areaName = document.getElementById("expansion-area-name").value.trim();
    const phone = document.getElementById("expansion-phone").value.trim();

    if (!areaName) return;

    window.appState.addAuditLog(`Expansion vote received for: ${areaName} (Contact: ${phone || 'N/A'})`);
    this.closeExpansionVoteModal();
    this.showToast("Request Registered!", `Thank you! We have added ${areaName} to our route planning board.`, "success");
  }

  // --- Toast Notifications ---
  showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-card toast-${type}`;
    
    const icon = type === "success" ? "✓" : (type === "error" ? "✕" : "ℹ");

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

window.app = new CrownBinsApp();
