import { Order } from '../types';

/**
 * Utility to convert numbers to Indian Rupee words (e.g., 348 -> "Three Hundred and Forty-Eight Rupees Only")
 */
function numberToWordsINR(amount: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const num = Math.floor(amount);
  if (num === 0) return 'Zero Rupees Only';

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let str = '';
    if (h > 0) str += units[h] + ' Hundred';
    if (h > 0 && rem > 0) str += ' and ';
    if (rem > 0) str += convertTwoDigits(rem);
    return str;
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  if (crore > 0) words += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertThreeDigits(thousand) + ' Thousand ';
  if (remainder > 0) words += convertThreeDigits(remainder);

  return words.trim() + ' Rupees Only';
}

/**
 * Generate full self-contained HTML for official CraveGo Tax Invoice / Bill of Supply
 */
export function generateInvoiceHTML(order: Order, user?: any): string {
  const invoiceNumber = `INV-2026-${order.id.replace(/[^0-9A-Z]/gi, '')}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const grandTotalInWords = numberToWordsINR(order.grandTotal);

  // SVG QR Code for verification
  const qrSvg = `
    <svg viewBox="0 0 100 100" width="84" height="84" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#ffffff" rx="8"/>
      <!-- QR Position Targets -->
      <rect x="8" y="8" width="26" height="26" fill="#0f172a" rx="4"/>
      <rect x="13" y="13" width="16" height="16" fill="#ffffff"/>
      <rect x="17" y="17" width="8" height="8" fill="#ef4444"/>

      <rect x="66" y="8" width="26" height="26" fill="#0f172a" rx="4"/>
      <rect x="71" y="13" width="16" height="16" fill="#ffffff"/>
      <rect x="75" y="17" width="8" height="8" fill="#ef4444"/>

      <rect x="8" y="66" width="26" height="26" fill="#0f172a" rx="4"/>
      <rect x="13" y="71" width="16" height="16" fill="#ffffff"/>
      <rect x="17" y="75" width="8" height="8" fill="#ef4444"/>

      <!-- Matrix Patterns -->
      <rect x="40" y="10" width="6" height="6" fill="#0f172a"/>
      <rect x="50" y="14" width="8" height="5" fill="#0f172a"/>
      <rect x="42" y="24" width="16" height="6" fill="#0f172a"/>
      <rect x="12" y="42" width="6" height="16" fill="#0f172a"/>
      <rect x="24" y="46" width="8" height="8" fill="#0f172a"/>
      <rect x="40" y="40" width="20" height="20" fill="#0f172a" rx="3"/>
      <rect x="45" y="45" width="10" height="10" fill="#ef4444"/>
      <rect x="68" y="42" width="12" height="6" fill="#0f172a"/>
      <rect x="84" y="48" width="8" height="8" fill="#0f172a"/>
      <rect x="42" y="68" width="8" height="14" fill="#0f172a"/>
      <rect x="56" y="74" width="18" height="8" fill="#0f172a"/>
      <rect x="78" y="70" width="14" height="18" fill="#0f172a"/>
    </svg>
  `;

  // Item rows HTML
  const itemsRows = order.items.map((it, idx) => {
    const itemSubtotal = it.totalPrice;
    const taxableValue = Number((itemSubtotal / 1.05).toFixed(2));
    const gstVal = Number((itemSubtotal - taxableValue).toFixed(2));
    const cgst = Number((gstVal / 2).toFixed(2));
    const sgst = Number((gstVal / 2).toFixed(2));

    const customizationNote = it.selectedCustomizations && it.selectedCustomizations.length > 0
      ? `<div style="font-size: 10.5px; color: #64748b; margin-top: 3px;">
          ${it.selectedCustomizations.map(c => `${c.groupName}: ${c.choiceNames.join(', ')}`).join(' • ')}
         </div>`
      : '';

    const vegIcon = it.foodItem?.isVeg
      ? `<span style="display:inline-block; border: 1.5px solid #10b981; border-radius: 3px; width: 11px; height: 11px; vertical-align: middle; text-align: center; line-height: 8px; margin-right: 5px;">
           <span style="display:inline-block; width: 5px; height: 5px; background: #10b981; border-radius: 50%;"></span>
         </span>`
      : `<span style="display:inline-block; border: 1.5px solid #ef4444; border-radius: 3px; width: 11px; height: 11px; vertical-align: middle; text-align: center; line-height: 8px; margin-right: 5px;">
           <span style="display:inline-block; width: 5px; height: 5px; background: #ef4444; border-radius: 50%;"></span>
         </span>`;

    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 8px; font-size: 11px; color: #64748b; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #0f172a; font-weight: 600;">
          ${vegIcon} ${it.foodItem?.name || 'Dish Item'}
          ${customizationNote}
        </td>
        <td style="padding: 10px 8px; font-size: 11px; color: #64748b; font-family: monospace; text-align: center;">996331</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #0f172a; text-align: center; font-weight: bold;">${it.quantity}</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #0f172a; text-align: right;">₹${it.unitPrice}</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #0f172a; text-align: right;">₹${taxableValue}</td>
        <td style="padding: 10px 8px; font-size: 11px; color: #64748b; text-align: right;">₹${cgst}</td>
        <td style="padding: 10px 8px; font-size: 11px; color: #64748b; text-align: right;">₹${sgst}</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #0f172a; font-weight: bold; text-align: right;">₹${itemSubtotal}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CraveGo Tax Invoice - ${invoiceNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 36px 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    }
    @media print {
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
    .print-actions {
      max-width: 820px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
      font-family: inherit;
    }
    .btn-primary {
      background: #ef4444;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }
    .btn-primary:hover {
      background: #dc2626;
    }
    .btn-secondary {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }
    .btn-secondary:hover {
      background: #f1f5f9;
    }
  </style>
</head>
<body>

  <!-- Screen Actions Bar (hidden when printing) -->
  <div class="print-actions no-print">
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print / Save as PDF
    </button>
  </div>

  <div class="invoice-container">

    <!-- Top Header: CraveGo 3D Brand Logo & Tax Invoice Title -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #f1f5f9;">
      <div>
        <!-- 3D Flame-Rocket CraveGo SVG Logo -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <svg viewBox="0 0 48 48" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoFlame" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FF2A2A"/>
                <stop offset="50%" stop-color="#FF6B00"/>
                <stop offset="100%" stop-color="#FFB800"/>
              </linearGradient>
              <linearGradient id="logoShield" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0f172a"/>
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="14" fill="url(#logoShield)"/>
            <!-- 3D Rocket Body -->
            <path d="M 24 9 C 27 15, 34 23, 34 32 C 34 38, 29 41, 24 41 C 19 41, 14 38, 14 32 C 14 23, 21 15, 24 9 Z" fill="url(#logoFlame)"/>
            <circle cx="24" cy="22" r="4.5" fill="#ffffff"/>
            <circle cx="24" cy="22" r="2.5" fill="#ef4444"/>
            <!-- Turbo Exhaust Wings -->
            <path d="M 17 33 L 11 37 L 16 28 Z" fill="#FF8A00"/>
            <path d="M 31 33 L 37 37 L 32 28 Z" fill="#FF8A00"/>
          </svg>
          <div>
            <div style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; line-height: 1;">
              CRAVE<span style="display: inline-block; background: #ef4444; color: #fff; padding: 2px 7px; border-radius: 7px; margin-left: 3px; font-size: 20px;">GO</span>
            </div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-top: 3px;">
              India's Premier Food Network
            </div>
          </div>
        </div>

        <div style="font-size: 11px; color: #475569; line-height: 1.45;">
          <strong>CraveGo Technologies Private Limited</strong><br>
          CIN: U72900KA2026PTC189421 • GSTIN: 29AABCC1234F1Z5<br>
          FSSAI Central Lic. No.: 11226999000124<br>
          100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038
        </div>
      </div>

      <!-- Invoice Title & Original Tag -->
      <div style="text-align: right;">
        <div style="display: inline-block; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          Original for Recipient
        </div>
        <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">TAX INVOICE</h1>
        <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 2px;">Bill of Supply (Under GST Act)</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: #ef4444; margin-top: 4px;">
          ${invoiceNumber}
        </div>
      </div>
    </div>

    <!-- Meta Details Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 11.5px;">
      <div>
        <span style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase; font-weight: 600;">Order ID</span>
        <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #0f172a;">#${order.id}</span>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase; font-weight: 600;">Invoice Date</span>
        <span style="font-weight: 600; color: #0f172a;">${orderDate}</span>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase; font-weight: 600;">Place of Supply</span>
        <span style="font-weight: 600; color: #0f172a;">Karnataka (29)</span>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase; font-weight: 600;">Reverse Charge</span>
        <span style="font-weight: 600; color: #0f172a;">No</span>
      </div>
    </div>

    <!-- Parties Grid: Customer Billed To & Restaurant Supplier -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 18px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px;">
      <!-- Customer Info -->
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="font-size: 10.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          Billed &amp; Delivered To
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
          ${user?.name || 'Rahul Sharma'}
        </div>
        <div style="color: #475569; margin-top: 3px; font-size: 11.5px; line-height: 1.4;">
          <strong>Phone:</strong> ${user?.phone || '+91 98765 43210'}<br>
          <strong>Address:</strong> ${order.deliveryAddress?.houseFlat ? `${order.deliveryAddress.houseFlat}, ` : ''}${order.deliveryAddress?.building ? `${order.deliveryAddress.building}, ` : ''}${order.deliveryAddress?.street || '100 Feet Road, Indiranagar'}, ${order.deliveryAddress?.city || 'Bengaluru'}, ${order.deliveryAddress?.state || 'Karnataka'} - ${order.deliveryAddress?.pinCode || '560038'}
        </div>
      </div>

      <!-- Restaurant Info -->
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="font-size: 10.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          Restaurant Partner
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
          ${order.restaurantName}
        </div>
        <div style="color: #475569; margin-top: 3px; font-size: 11.5px; line-height: 1.4;">
          <strong>FSSAI Lic No:</strong> 11224333000889<br>
          <strong>Merchant GSTIN:</strong> 29AAEFK4432G1ZP<br>
          <strong>Dispatched By:</strong> ${order.rider?.name || 'Rajesh Kumar'} (${order.rider?.vehicle || 'Ather 450X EV'})
        </div>
      </div>
    </div>

    <!-- Itemized Tax Invoice Table -->
    <div style="padding: 18px 0;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #475569;">
            <th style="padding: 10px 8px; text-align: center; border-radius: 8px 0 0 8px;">#</th>
            <th style="padding: 10px 8px;">Item Description</th>
            <th style="padding: 10px 8px; text-align: center;">SAC</th>
            <th style="padding: 10px 8px; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; text-align: right;">Rate</th>
            <th style="padding: 10px 8px; text-align: right;">Taxable</th>
            <th style="padding: 10px 8px; text-align: right;">CGST</th>
            <th style="padding: 10px 8px; text-align: right;">SGST</th>
            <th style="padding: 10px 8px; text-align: right; border-radius: 0 8px 8px 0;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Charges & Taxes Calculation Grid -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; padding-top: 8px; border-top: 2px solid #f1f5f9;">
      <!-- Left: Payment Verification Badge & QR -->
      <div style="display: flex; gap: 16px; align-items: center; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div>${qrSvg}</div>
        <div style="font-size: 11.5px; line-height: 1.45;">
          <div style="display: inline-flex; align-items: center; gap: 5px; background: #ecfdf5; color: #059669; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-size: 11px; margin-bottom: 6px;">
            <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%;"></span>
            VERIFIED PAID
          </div>
          <div style="color: #0f172a; font-weight: 700;">Mode: ${order.paymentMethod || 'UPI / Instant Pay'}</div>
          <div style="color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; margin-top: 2px;">
            Txn ID: CRV-${order.id}-982
          </div>
          <div style="color: #94a3b8; font-size: 10px; margin-top: 4px;">
            Scan QR to verify tax compliance on CraveGo Portal
          </div>
        </div>
      </div>

      <!-- Right: Financial Breakdown -->
      <div style="font-size: 12px; color: #334155; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between;">
          <span>Item Subtotal:</span>
          <span style="font-weight: 600; color: #0f172a;">₹${order.itemTotal}</span>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <span>GST &amp; Restaurant Tax (5%):</span>
          <span style="font-weight: 600; color: #0f172a;">₹${order.taxes}</span>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <span>Restaurant Packaging:</span>
          <span style="font-weight: 600; color: #0f172a;">₹25</span>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <span>Delivery Partner Fee:</span>
          <span style="font-weight: 600; color: #0f172a;">
            ${order.deliveryFee === 0 ? '<span style="color: #16a34a; font-weight: bold;">FREE (CraveGo Gold)</span>' : `₹${order.deliveryFee}`}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <span>Platform Convenience Fee:</span>
          <span style="font-weight: 600; color: #0f172a;">₹${order.platformFee.toFixed(2)}</span>
        </div>

        ${order.tip ? `
        <div style="display: flex; justify-content: space-between; color: #059669;">
          <span>Delivery Partner Tip (100% to Valet):</span>
          <span style="font-weight: 600;">₹${order.tip}</span>
        </div>` : ''}

        ${order.donation ? `
        <div style="display: flex; justify-content: space-between; color: #0284c7;">
          <span>Feeding India Contribution:</span>
          <span style="font-weight: 600;">₹${order.donation}</span>
        </div>` : ''}

        ${order.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; color: #dc2626; font-weight: 700;">
          <span>Promo Discount (${order.couponApplied || 'OFFER'}):</span>
          <span>-₹${order.discount}</span>
        </div>` : ''}

        <!-- Grand Total Highlight -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 8px; font-size: 16px; font-weight: 900; color: #0f172a;">
          <span>Grand Total Paid:</span>
          <span style="color: #ef4444; font-size: 19px;">₹${order.grandTotal}</span>
        </div>
      </div>
    </div>

    <!-- Amount in Words -->
    <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px; margin-top: 18px; font-size: 11.5px; color: #334155;">
      <strong>Amount in Words:</strong> ${grandTotalInWords}
    </div>

    <!-- Footer Legal & Digital Signature -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 18px; border-top: 1px dashed #cbd5e1; font-size: 10.5px; color: #64748b;">
      <div style="max-width: 480px; line-height: 1.45;">
        <strong>Terms &amp; Conditions:</strong><br>
        1. This is an electronically generated Tax Invoice and does not require a physical signature.<br>
        2. Food quality, freshness, and preparation are the sole responsibility of the merchant partner.<br>
        3. For grievances or instant refunds, write to <strong>support@cravego.app</strong> or call <strong>1800-CRAVE-GO</strong>.
      </div>

      <div style="text-align: right;">
        <div style="font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 4px;">
          For CraveGo Technologies Pvt Ltd
        </div>
        <div style="display: inline-block; border-bottom: 1.5px solid #94a3b8; width: 140px; margin-bottom: 4px;"></div>
        <div style="font-size: 10px; color: #94a3b8;">Authorized Signatory</div>
      </div>
    </div>

  </div>

</body>
</html>`;
}

/**
 * Trigger immediate browser print / "Save as PDF" dialog
 */
export function printInvoiceDocument(order: Order, user?: any): void {
  const html = generateInvoiceHTML(order, user);
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for styles to settle before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  } else {
    // Fallback if popups blocked: trigger file download
    downloadInvoiceFile(order, user);
  }
}

/**
 * Trigger immediate file download of standalone HTML document
 */
export function downloadInvoiceFile(order: Order, user?: any): void {
  const html = generateInvoiceHTML(order, user);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CraveGo_Tax_Invoice_${order.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
