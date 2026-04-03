import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    studentName,
    studentEmail,
    studentPhone,
    course,
    classType,
    sessionsPerWeek,
    totalSessions,
    monthsDuration,
    amount,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
  }

  // ─── Verify Razorpay signature ───
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 503 });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
  }

  // ─── Send emails ───
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const ownerEmail = process.env.OWNER_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass) {
    // Signature valid — skip email if SMTP not configured
    return NextResponse.json({ ok: true, emailSkipped: true });
  }

  const classLabel = classType === 'individual' ? 'Individual (1-on-1)' : 'Group (4–6 Students)';
  const sessions = totalSessions ?? sessionsPerWeek * 4 * 3;
  const duration = monthsDuration ?? 3;
  const amountFormatted = `₹${Number(amount).toLocaleString('en-IN')}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  });

  const headerStyle = 'background:linear-gradient(135deg,#1565C0,#0D47A1);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;';
  const rowStyle = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 12px;background:#eceef0;border-radius:6px;font-size:13px;font-weight:600;color:#424752;width:40%;vertical-align:top;">${label}</td>
      <td style="padding:10px 12px;font-size:14px;color:#191c1e;vertical-align:top;">${value}</td>
    </tr>
    <tr><td colspan="2" style="padding:2px;"></td></tr>
  `;

  const ownerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
      <div style="${headerStyle}">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">New Course Enrollment — Payment Received</h1>
        <p style="margin:0;opacity:0.8;font-size:14px;">Chaturangveda · ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rowStyle('Student Name', studentName || '—')}
        ${rowStyle('Email', studentEmail || '—')}
        ${rowStyle('Phone / WhatsApp', studentPhone || '—')}
        ${rowStyle('Course', course || '—')}
        ${rowStyle('Class Type', classLabel)}
        ${rowStyle('Sessions / Week', `${sessionsPerWeek}× per week · ${sessions} sessions over ${duration} months`)}
        ${rowStyle('Amount Paid', amountFormatted)}
        ${rowStyle('Payment ID', razorpay_payment_id)}
        ${rowStyle('Order ID', razorpay_order_id)}
      </table>
      <div style="margin-top:24px;padding:16px;background:#D6E3FF;border-radius:8px;font-size:13px;color:#004D99;">
        Contact the student on <strong>${studentPhone || 'N/A'}</strong> or reply to this email to schedule the first session.
      </div>
    </div>
  `;

  const studentHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f7f9fb;border-radius:12px;">
      <div style="${headerStyle}">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;">Enrollment Confirmed ♟</h1>
        <p style="margin:0;opacity:0.8;font-size:14px;">Welcome to Chaturangveda — your chess journey starts here.</p>
      </div>
      <p style="font-size:16px;color:#191c1e;line-height:1.7;">Hi <strong>${studentName || 'there'}</strong>,</p>
      <p style="font-size:15px;color:#424752;line-height:1.7;">
        Your payment of <strong>${amountFormatted}</strong> for the <strong>${course}</strong> course has been received successfully.
        Here's a summary of your enrollment:
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        ${rowStyle('Course', course || '—')}
        ${rowStyle('Class Type', classLabel)}
        ${rowStyle('Sessions', `${sessionsPerWeek}× per week · ${sessions} sessions over ${duration} months`)}
        ${rowStyle('Amount', amountFormatted)}
        ${rowStyle('Payment Reference', razorpay_payment_id)}
      </table>
      <p style="font-size:15px;color:#424752;line-height:1.7;">
        Our team will reach out to you at <strong>${studentPhone || 'your registered contact'}</strong> within 24 hours to schedule your first session and assign your coach.
      </p>
      <p style="font-size:15px;color:#424752;line-height:1.7;">
        Meanwhile, if you have any questions, WhatsApp us at <strong>+91 75691 94709</strong>.
      </p>
      <div style="margin-top:28px;text-align:center;">
        <a href="https://wa.me/+917569194709" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#1565C0,#0D47A1);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Message Us on WhatsApp
        </a>
      </div>
      <p style="font-size:13px;color:#727783;margin-top:32px;text-align:center;">Chaturangveda · New Era in Teaching Chess · Hyderabad, India</p>
    </div>
  `;

  const promises: Promise<unknown>[] = [
    transporter.sendMail({
      from: `"Chaturangveda Website" <${smtpUser}>`,
      to: ownerEmail,
      subject: `New Enrollment — ${studentName} · ${course}`,
      html: ownerHtml,
    }),
  ];

  if (studentEmail) {
    promises.push(
      transporter.sendMail({
        from: `"Chaturangveda" <${smtpUser}>`,
        to: studentEmail,
        subject: `Enrollment Confirmed — ${course} · Chaturangveda ♟`,
        html: studentHtml,
      })
    );
  }

  try {
    await Promise.all(promises);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email send error:', err);
    // Payment was verified — don't fail the response for email issues
    return NextResponse.json({ ok: true, emailError: true });
  }
}
