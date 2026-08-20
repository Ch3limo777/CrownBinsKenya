/**
 * CrownBins Solutions Kenya - PDF & Document Generator
 * Generates beautiful, printable and downloadable branded Invoices and Receipts
 */

class CrownBinsDocGenerator {
  static formatKES(amount) {
    return `KES ${(Number(amount) || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  static generateInvoiceHTML(invoice, company = window.appState.state.company) {
    const isPaid = invoice.status === "Paid";
    const statusColor = isPaid ? "#16A34A" : (invoice.status === "Overdue" ? "#DC2626" : "#D97706");
    const statusBg = isPaid ? "#DCFCE7" : (invoice.status === "Overdue" ? "#FEE2E2" : "#FEF3C7");

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${isPaid ? 'Receipt' : 'Invoice'} - ${invoice.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; }
          body { background: #f8fafc; padding: 40px 20px; color: #1e293b; display: flex; justify-content: center; }
          .document-container {
            background: #ffffff;
            width: 100%;
            max-width: 800px;
            padding: 48px;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            border: 1px solid #e2e8f0;
          }
          .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 28px;
            margin-bottom: 28px;
          }
          .brand-col { display: flex; align-items: center; gap: 14px; }
          .logo-mark {
            width: 50px;
            height: 50px;
            background: #15803D;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 24px;
          }
          .brand-col h1 { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 700; color: #111827; }
          .brand-col p { font-size: 13px; color: #64748b; margin-top: 2px; font-style: italic; }
          .doc-title-col { text-align: right; }
          .doc-type { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #15803D; letter-spacing: -0.5px; }
          .doc-num { font-size: 15px; font-weight: 600; color: #475569; margin-top: 4px; }
          .status-badge {
            display: inline-block;
            margin-top: 8px;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: ${statusBg};
            color: ${statusColor};
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 32px;
            font-size: 13px;
          }
          .meta-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 8px; font-weight: 700; }
          .meta-block p { color: #334155; line-height: 1.5; }
          .meta-block strong { color: #0f172a; font-weight: 600; font-size: 14px; }
          .line-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }
          .line-table th {
            background: #f8fafc;
            text-align: left;
            padding: 12px 14px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
          }
          .line-table td {
            padding: 16px 14px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            color: #334155;
          }
          .line-table .text-right { text-align: right; }
          .summary-card {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 32px;
          }
          .summary-table { width: 300px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
          .summary-row.total {
            border-top: 2px solid #0f172a;
            margin-top: 8px;
            padding-top: 12px;
            font-family: 'Outfit', sans-serif;
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
          }
          .payment-info-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 28px;
          }
          .payment-info-box h4 { font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 8px; }
          .payment-info-box p { font-size: 12px; color: #15803d; line-height: 1.6; }
          .footer-note {
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 24px;
            font-size: 12px;
            color: #94a3b8;
          }
          .action-bar {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn {
            background: #15803D;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: none;
            font-size: 13px;
          }
          .btn-secondary { background: #334155; }
          @media print {
            body { background: transparent; padding: 0; }
            .document-container { box-shadow: none; border: none; padding: 0; width: 100%; }
            .action-bar { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="document-container">
          <div class="doc-header">
            <div class="brand-col">
              <div class="logo-mark">CB</div>
              <div>
                <h1>${company.name}</h1>
                <p>“${company.tagline}”</p>
              </div>
            </div>
            <div class="doc-title-col">
              <div class="doc-type">${isPaid ? 'OFFICIAL RECEIPT' : 'INVOICE'}</div>
              <div class="doc-num">${invoice.id}</div>
              <span class="status-badge">${invoice.status}</span>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-block">
              <h3>Billed To</h3>
              <strong>${invoice.customerName}</strong>
              <p>${invoice.customerAddress || 'Nairobi, Kenya'}</p>
              <p>Phone: ${invoice.customerPhone || 'N/A'}</p>
              <p>Email: ${invoice.customerEmail || 'N/A'}</p>
            </div>
            <div class="meta-block" style="text-align: right;">
              <h3>Invoice & Company Details</h3>
              <p><strong>Invoice Date:</strong> ${invoice.date}</p>
              <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
              ${isPaid && invoice.paidDate ? `<p><strong>Paid Date:</strong> ${invoice.paidDate}</p>` : ''}
              ${isPaid && invoice.transactionCode ? `<p><strong>M-Pesa / Ref:</strong> <span style="font-family:monospace;font-weight:bold;color:#15803D;">${invoice.transactionCode}</span></p>` : ''}
              <p><strong>KRA PIN:</strong> ${company.kraPin}</p>
            </div>
          </div>

          <table class="line-table">
            <thead>
              <tr>
                <th>Service & Bag Type</th>
                <th>Period</th>
                <th>Qty</th>
                <th class="text-right">Rate / Mo</th>
                <th class="text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${invoice.bagType || 'Standard Waste Collection'}</strong>
                  <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Twice-weekly scheduled residential collection & door pickup</div>
                </td>
                <td>${invoice.period || `${invoice.subscriptionMonths || 3} Months`}</td>
                <td>${invoice.bagQty || 8} Bags/Mo</td>
                <td class="text-right">${CrownBinsDocGenerator.formatKES(invoice.ratePerMonth || (invoice.total / (invoice.subscriptionMonths || 3)))}</td>
                <td class="text-right">${CrownBinsDocGenerator.formatKES(invoice.subtotal || invoice.total)}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary-card">
            <div class="summary-table">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${CrownBinsDocGenerator.formatKES(invoice.subtotal || invoice.total)}</span>
              </div>
              ${invoice.discount ? `
                <div class="summary-row" style="color: #16a34a;">
                  <span>Subscription Discount:</span>
                  <span>- ${CrownBinsDocGenerator.formatKES(invoice.discount)}</span>
                </div>
              ` : ''}
              <div class="summary-row">
                <span>VAT (0% Exempt/Standard):</span>
                <span>KES 0.00</span>
              </div>
              <div class="summary-row total">
                <span>Total Due:</span>
                <span>${CrownBinsDocGenerator.formatKES(invoice.total)}</span>
              </div>
            </div>
          </div>

          <div class="payment-info-box">
            <h4>${isPaid ? 'Payment Confirmation' : 'Payment Instructions (Safaricom M-Pesa & Bank)'}</h4>
            ${isPaid ? `
              <p>Thank you! Your payment of <strong>${CrownBinsDocGenerator.formatKES(invoice.total)}</strong> has been verified via <strong>${invoice.paymentMethod || 'M-Pesa'}</strong> with reference code <strong>${invoice.transactionCode || 'CONFIRMED'}</strong>. Your collection service remains fully active.</p>
            ` : `
              <p><strong>Option 1 - Safaricom M-Pesa Paybill:</strong> Paybill No. <strong>${company.paybill}</strong> | Account No: <strong>${invoice.customerId || 'CROWNBINS'}</strong><br>
              <strong>Option 2 - Safaricom Till Number:</strong> Buy Goods & Services Till: <strong>${company.tillNumber}</strong><br>
              <strong>Option 3 - Bank Transfer:</strong> Equity Bank A/C: <strong>0180293847192</strong> (CrownBins Solutions Kenya Ltd)</p>
            `}
          </div>

          <div class="footer-note">
            <p>${company.legalName} &bull; ${company.address}</p>
            <p>Customer Support: ${company.phone} | WhatsApp: ${company.whatsapp} | Email: ${company.supportEmail}</p>
            <p style="margin-top: 6px; font-weight: 500;">Thank you for partnering with CrownBins to keep our communities clean and green!</p>
          </div>

          <div class="action-bar">
            <button class="btn" onclick="window.print()">Print / Save as PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static openDocumentInNewTab(invoice) {
    const html = CrownBinsDocGenerator.generateInvoiceHTML(invoice);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  static shareToWhatsApp(invoice) {
    const isPaid = invoice.status === "Paid";
    const text = isPaid 
      ? `*CrownBins Solutions Kenya Receipt - ${invoice.id}*\n\nHello ${invoice.customerName},\nThank you for your payment of *${CrownBinsDocGenerator.formatKES(invoice.total)}* via ${invoice.paymentMethod} (Ref: ${invoice.transactionCode}).\nYour service is active for ${invoice.period}.\n\nView or download: https://crownbins.co.ke/portal`
      : `*CrownBins Solutions Kenya Invoice - ${invoice.id}*\n\nHello ${invoice.customerName},\nYour invoice for ${invoice.period} (${invoice.bagQty} ${invoice.bagType}) is due on *${invoice.dueDate}*.\nAmount: *${CrownBinsDocGenerator.formatKES(invoice.total)}*\n\nPay via M-Pesa Paybill *522522* (A/C: ${invoice.customerId}) or Till *8472910*.\nPortal: https://crownbins.co.ke/portal`;
    
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(invoice.customerPhone || '')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}

window.CrownBinsDocGenerator = CrownBinsDocGenerator;
