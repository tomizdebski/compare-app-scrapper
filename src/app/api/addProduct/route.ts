// src/app/api/addProduct/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prismaClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, price, link } = body;

    // Walidacja danych
    if (!title || !price || !link) {
      return NextResponse.json({ error: 'Wszystkie pola są wymagane' }, { status: 400 });
    }

    // Dodawanie produktu do bazy
    const newProduct = await prisma.product.create({
      data: { title, price, link },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Błąd podczas dodawania produktu' }, { status: 500 });
  }
}
