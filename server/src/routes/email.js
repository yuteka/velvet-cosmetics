import { Router } from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const VERIFIED_EMAIL = 'yutekahema003@gmail.com'; // ✅ your Resend verified email

// Welcome Email — Signup
router.post('/send-welcome', async (req, res) => {
  const { email, firstName } = req.body;
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: VERIFIED_EMAIL, // ✅ fixed
      subject: `Welcome to Velvet ✦ (${email})`,
      html: `
        <div style="background:#0a0806;padding:40px;font-family:Georgia,serif;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a96e;letter-spacing:0.3em;font-weight:300;">VELVET</h1>
          <p style="color:#e8d5b0;font-size:12px;letter-spacing:0.4em;">LUXURY COSMETICS</p>
          <hr style="border-color:rgba(201,169,110,0.2);margin:24px 0;" />
          <h2 style="color:#faf8f4;font-weight:300;font-size:28px;">Welcome, ${firstName}!</h2>
          <p style="color:#7a6e5f;font-size:14px;line-height:1.8;">
            New user signed up: <strong style="color:#c9a96e;">${email}</strong><br/>
            Thank you for joining the Velvet Circle.
          </p>
          <div style="margin:32px 0;padding:20px;border:1px solid rgba(201,169,110,0.2);">
            <p style="color:#c9a96e;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">Your Welcome Gift</p>
            <p style="color:#faf8f4;font-size:24px;font-weight:300;margin:0;letter-spacing:0.2em;">VELVET20</p>
            <p style="color:#7a6e5f;font-size:12px;margin:8px 0 0;">Use this code for 20% off your first order</p>
          </div>
          <hr style="border-color:rgba(201,169,110,0.1);margin:32px 0;" />
          <p style="color:#4a3f30;font-size:11px;">© 2026 Velvet Luxury Cosmetics</p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Notification Email
router.post('/send-login', async (req, res) => {
  const { email, firstName } = req.body;
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: VERIFIED_EMAIL, // ✅ fixed
      subject: `New Login ✦ ${email}`,
      html: `
        <div style="background:#0a0806;padding:40px;font-family:Georgia,serif;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a96e;letter-spacing:0.3em;font-weight:300;">VELVET</h1>
          <p style="color:#e8d5b0;font-size:12px;letter-spacing:0.4em;">LUXURY COSMETICS</p>
          <hr style="border-color:rgba(201,169,110,0.2);margin:24px 0;" />
          <h2 style="color:#faf8f4;font-weight:300;font-size:24px;">Login Detected</h2>
          <p style="color:#7a6e5f;font-size:14px;line-height:1.8;">
            User <strong style="color:#c9a96e;">${email}</strong> (${firstName}) just logged in.
          </p>
          <div style="margin:24px 0;padding:16px;border-left:3px solid #c9a96e;background:rgba(201,169,110,0.05);">
            <p style="color:#7a6e5f;font-size:12px;margin:0;">Time: ${new Date().toLocaleString()}</p>
          </div>
          <hr style="border-color:rgba(201,169,110,0.1);margin:32px 0;" />
          <p style="color:#4a3f30;font-size:11px;">© 2026 Velvet Luxury Cosmetics</p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Confirmation Email
router.post('/send-order', async (req, res) => {
  const { email, firstName, orderId, items, total, address } = req.body;
  try {
    const itemsHtml = items?.map(item => `
      <tr>
        <td style="padding:12px;color:#faf8f4;font-size:13px;">${item.name}</td>
        <td style="padding:12px;color:#7a6e5f;font-size:13px;text-align:center;">x${item.qty}</td>
        <td style="padding:12px;color:#c9a96e;font-size:13px;text-align:right;">$${item.price}</td>
      </tr>
    `).join('') || '';

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: VERIFIED_EMAIL, // ✅ fixed
      subject: `Order Confirmed ✦ #${orderId} (${email})`,
      html: `
        <div style="background:#0a0806;padding:40px;font-family:Georgia,serif;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a96e;letter-spacing:0.3em;font-weight:300;">VELVET</h1>
          <p style="color:#e8d5b0;font-size:12px;letter-spacing:0.4em;">LUXURY COSMETICS</p>
          <hr style="border-color:rgba(201,169,110,0.2);margin:24px 0;" />
          <div style="text-align:center;padding:24px 0;">
            <h2 style="color:#faf8f4;font-weight:300;font-size:28px;margin:0;">Order Confirmed!</h2>
            <p style="color:#7a6e5f;font-size:13px;margin:8px 0 0;">
              Customer: <strong style="color:#c9a96e;">${firstName} (${email})</strong>
            </p>
          </div>
          <div style="padding:16px;background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.15);margin:24px 0;">
            <p style="color:#c9a96e;font-size:18px;font-weight:300;margin:0;letter-spacing:0.2em;">#${orderId}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead>
              <tr style="border-bottom:1px solid rgba(201,169,110,0.15);">
                <th style="padding:12px;color:#7a6e5f;font-size:11px;text-align:left;font-weight:400;">ITEM</th>
                <th style="padding:12px;color:#7a6e5f;font-size:11px;text-align:center;font-weight:400;">QTY</th>
                <th style="padding:12px;color:#7a6e5f;font-size:11px;text-align:right;font-weight:400;">PRICE</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr style="border-top:1px solid rgba(201,169,110,0.15);">
                <td colspan="2" style="padding:12px;color:#7a6e5f;font-size:13px;">Total</td>
                <td style="padding:12px;color:#c9a96e;font-size:20px;text-align:right;font-weight:300;">$${total}</td>
              </tr>
            </tfoot>
          </table>
          ${address ? `<div style="padding:16px;border:1px solid rgba(201,169,110,0.15);margin:24px 0;">
            <p style="color:#7a6e5f;font-size:11px;text-transform:uppercase;margin:0 0 8px;">Shipping To</p>
            <p style="color:#faf8f4;font-size:13px;margin:0;line-height:1.6;">${address}</p>
          </div>` : ''}
          <hr style="border-color:rgba(201,169,110,0.1);margin:32px 0;" />
          <p style="color:#4a3f30;font-size:11px;">© 2026 Velvet Luxury Cosmetics</p>
        </div>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
