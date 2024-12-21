// src/app/api/deleteProduct/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prismaClient';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    // Walidacja danych wejściowych
    if (!id) {
      return NextResponse.json({ error: 'ID produktu jest wymagane' }, { status: 400 });
    }

    // Usuwanie produktu z bazy danych
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Produkt został usunięty', deletedProduct }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania produktu:', error);

    // Obsługa błędów
    return NextResponse.json(
      { error: 'Nie udało się usunąć produktu' },
      { status: 500 }
    );
  }
}
