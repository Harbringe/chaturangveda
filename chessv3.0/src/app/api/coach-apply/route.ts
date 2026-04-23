import { NextRequest, NextResponse } from 'next/server';
import { sendEmailJs } from '@/lib/emailjs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, countryCode, phone, email, experience, rating, availability, message } = body;

  if (!name || !phone || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const fullPhone = `${countryCode || ''}${String(phone).replace(/[\s\-()]/g, '')}`;

  try {
    await sendEmailJs({
      form_type: 'Coach Application',
      subject: `New Coach Application - ${name}`,
      name,
      email,
      phone: fullPhone,
      experience: experience || 'Not provided',
      rating: rating || 'Not rated',
      availability: availability || 'Flexible',
      message: message || 'No message',
      details: [
        `Full Name: ${name}`,
        `Email: ${email}`,
        `Phone / WhatsApp: ${fullPhone}`,
        `Experience: ${experience || 'Not provided'}`,
        `FIDE Rating: ${rating || 'Not rated'}`,
        `Availability: ${availability || 'Flexible'}`,
        `About: ${message || 'No message'}`,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('EmailJS error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
