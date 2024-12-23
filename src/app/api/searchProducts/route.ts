// app/api/searchProducts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scrapeEbay, Product as EbayProduct } from '../../scrapers/ebayScraper';
//import { scrapeAllegro, Product as AllegroProduct } from '../../scrapers/allegroScraper';
import { scrapeAmazon, Product as AmazonProduct } from '@/app/scrapers/amazonScraper';

interface SearchResponse {
  ebay: EbayProduct[];
  amazon: AmazonProduct[];
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
    const [ebayResults, amazonResults] = await Promise.all([
      scrapeEbay(query),
      scrapeAmazon(query),
    ]);

    const responseData: SearchResponse = {
      ebay: ebayResults,
      amazon: amazonResults
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
