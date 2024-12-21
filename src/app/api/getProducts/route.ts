// src/app/api/getProducts/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prismaClient';

export async function GET() {
  try {
    // Pobieranie wszystkich produktów z bazy danych
    const products = await prisma.product.findMany();

    // Zwracanie produktów w formacie JSON
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);

    // Zwracanie błędu w przypadku problemów
    return NextResponse.json(
      { error: 'Nie udało się pobrać produktów.' },
      { status: 500 }
    );
  }
}
