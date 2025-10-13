// NextAuth API disabled temporarily
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ user: null }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ user: null }, { status: 200 });
}