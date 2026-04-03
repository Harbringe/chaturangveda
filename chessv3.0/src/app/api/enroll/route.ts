import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, currency = 'INR', receipt, notes } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay credentials not configured.' }, { status: 503 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: notes || {},
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
