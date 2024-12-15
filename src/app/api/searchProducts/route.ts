// app/api/searchProducts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scrapeEbay, Product as EbayProduct } from '../../scrappers/ebayScraper';
import { scrapeAllegro, Product as AllegroProduct } from '../../scrappers/allegroScraper';

interface SearchResponse {
  ebay: EbayProduct[];
  allegro: AllegroProduct[];
  error?: string;
}

// Opcjonalnie: Implementacja cache lub rate limiting
let lastQuery = '';
let lastResult: SearchResponse | null = null;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  // Opcjonalnie: Cache'owanie ostatniego zapytania
  if (lastQuery === query && lastResult) {
    return NextResponse.json(lastResult);
  }

  try {
    const [ebayResults, allegroResults] = await Promise.all([
      scrapeEbay(query),
      scrapeAllegro(query),
    ]);

    const responseData: SearchResponse = {
      ebay: ebayResults,
      allegro: allegroResults,
    };

    // Aktualizacja cache
    lastQuery = query;
    lastResult = responseData;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error scraping products:', error);
    return NextResponse.json({ error: 'Failed to scrape products.' }, { status: 500 });
  }
}
