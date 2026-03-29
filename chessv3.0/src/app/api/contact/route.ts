import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { parentName, childName, childAge, phone, level, preferredTime, message, email } = body;

  if (!parentName || !childName || !childAge || !phone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const ownerEmail = process.env.OWNER_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass) {
    // If email not configured, still return success (WhatsApp fallback handles it)
    return NextResponse.json({ ok: true, fallback: true });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  });

  const ownerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
      <div style="background:linear-gradient(135deg,#1565C0,#0D47A1);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">New Free Trial Booking</h1>
        <p style="margin:0;opacity:0.8;font-size:14px;">Chaturangveda — via website form</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Parent / Guardian', parentName],
          ["Child's Name", childName],
          ["Child's Age", childAge],
          ['WhatsApp', phone],
          ['Level', level],
          ['Preferred Time', preferredTime || 'Flexible'],
          ['Email', email || 'Not provided'],
          ['Message', message || '—'],
        ].map(([k, v]) => `
          <tr>
            <td style="padding:10px 12px;background:#eceef0;border-radius:6px;font-size:13px;font-weight:600;color:#424752;width:40%;vertical-align:top;">${k}</td>
            <td style="padding:10px 12px;font-size:14px;color:#191c1e;vertical-align:top;">${v}</td>
          </tr>
          <tr><td colspan="2" style="padding:2px;"></td></tr>
        `).join('')}
      </table>
      <div style="margin-top:24px;padding:16px;background:#D6E3FF;border-radius:8px;font-size:13px;color:#004D99;">
        Reply to this email or WhatsApp <strong>${phone}</strong> to confirm the trial slot.
      </div>
    </div>
  `;

  const promises: Promise<unknown>[] = [
    transporter.sendMail({
      from: `"Chaturangveda Website" <${smtpUser}>`,
      to: ownerEmail,
      subject: `New Free Trial Booking — ${childName} (Age ${childAge})`,
      html: ownerHtml,
    }),
  ];

  if (email) {
    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#1565C0,#0D47A1);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">Your Trial is Booked! ♟</h1>
          <p style="margin:0;opacity:0.8;font-size:14px;">We&apos;ve received your request and will confirm shortly.</p>
        </div>
        <p style="font-size:16px;color:#191c1e;line-height:1.7;">Hi <strong>${parentName}</strong>,</p>
        <p style="font-size:15px;color:#424752;line-height:1.7;">
          Thank you for booking a free trial class for <strong>${childName}</strong> at Chaturangveda!
          Our team will reach out on WhatsApp (<strong>${phone}</strong>) within a few hours to confirm your slot.
        </p>
        <p style="font-size:15px;color:#424752;line-height:1.7;">
          In the meantime, feel free to WhatsApp us at <strong>+91 75691 94709</strong> if you have any questions.
        </p>
        <div style="margin-top:32px;text-align:center;">
          <a href="https://wa.me/+917569194709" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#1565C0,#004D99);color:#fff;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;">Chat on WhatsApp</a>
        </div>
        <p style="font-size:13px;color:#727783;margin-top:32px;text-align:center;">Chaturangveda · New Era in Teaching Chess · Hyderabad, India</p>
      </div>
    `;
    promises.push(
      transporter.sendMail({
        from: `"Chaturangveda" <${smtpUser}>`,
        to: email,
        subject: `Your Free Trial is Confirmed — Chaturangveda ♟`,
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
