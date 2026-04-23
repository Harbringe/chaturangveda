import { NextRequest, NextResponse } from 'next/server';
import { sendEmailJs } from '@/lib/emailjs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { parentName, childName, childAge, phone, level, preferredTime, message, email } = body;

  if (!parentName || !childName || !childAge || !phone || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    await sendEmailJs({
      form_type: 'Free Trial Booking',
      subject: `New Free Trial Booking - ${childName} (Age ${childAge})`,
      parent_name: parentName,
      child_name: childName,
      child_age: childAge,
      name: parentName,
      email,
      phone,
      level: level || 'Not provided',
      preferred_time: preferredTime || 'Flexible',
      message: message || 'No message',
      details: [
        `Parent / Guardian: ${parentName}`,
        `Child: ${childName}`,
        `Age: ${childAge}`,
        `Email: ${email}`,
        `WhatsApp: ${phone}`,
        `Level: ${level || 'Not provided'}`,
        `Preferred Time: ${preferredTime || 'Flexible'}`,
        `Message: ${message || 'No message'}`,
      ].join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('EmailJS error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
