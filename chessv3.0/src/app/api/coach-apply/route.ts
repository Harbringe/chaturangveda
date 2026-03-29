import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, experience, rating, availability, message } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const ownerEmail = process.env.OWNER_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({ ok: true, fallback: true });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  });

  const ownerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
      <div style="background:linear-gradient(135deg,#1565C0,#0D47A1);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">New Coach Application</h1>
        <p style="margin:0;opacity:0.8;font-size:14px;">Chaturangveda — via website form</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Full Name', name],
          ['Phone / WhatsApp', phone],
          ['Email', email || 'Not provided'],
          ['Experience', experience],
          ['FIDE Rating', rating || 'Not rated'],
          ['Availability', availability || 'Flexible'],
          ['About', message || '—'],
        ].map(([k, v]) => `
          <tr>
            <td style="padding:10px 12px;background:#eceef0;border-radius:6px;font-size:13px;font-weight:600;color:#424752;width:40%;vertical-align:top;">${k}</td>
            <td style="padding:10px 12px;font-size:14px;color:#191c1e;vertical-align:top;">${v}</td>
          </tr>
          <tr><td colspan="2" style="padding:2px;"></td></tr>
        `).join('')}
      </table>
      <div style="margin-top:24px;padding:16px;background:#D6E3FF;border-radius:8px;font-size:13px;color:#004D99;">
        Reply to this email or WhatsApp <strong>${phone}</strong> to follow up with the applicant.
      </div>
    </div>
  `;

  const promises: Promise<unknown>[] = [
    transporter.sendMail({
      from: `"Chaturangveda Website" <${smtpUser}>`,
      to: ownerEmail,
      subject: `New Coach Application — ${name}`,
      html: ownerHtml,
    }),
  ];

  if (email) {
    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#1565C0,#0D47A1);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">Application Received! ♟</h1>
          <p style="margin:0;opacity:0.8;font-size:14px;">We&apos;ll review your application and get back to you soon.</p>
        </div>
        <p style="font-size:16px;color:#191c1e;line-height:1.7;">Hi <strong>${name}</strong>,</p>
        <p style="font-size:15px;color:#424752;line-height:1.7;">
          Thank you for applying to join the Chaturangveda coaching team! We&apos;ve received your application and will review it carefully.
          Expect to hear from us on WhatsApp (<strong>${phone}</strong>) or by email within 2–3 business days.
        </p>
        <p style="font-size:15px;color:#424752;line-height:1.7;">
          If you&apos;d like to follow up, WhatsApp us at <strong>+91 75691 94709</strong>.
        </p>
        <p style="font-size:13px;color:#727783;margin-top:32px;text-align:center;">Chaturangveda · New Era in Teaching Chess · Hyderabad, India</p>
      </div>
    `;
    promises.push(
      transporter.sendMail({
        from: `"Chaturangveda" <${smtpUser}>`,
        to: email,
        subject: `Your Coach Application — Chaturangveda ♟`,
        html: confirmHtml,
      })
    );
  }

  try {
    await Promise.all(promises);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
