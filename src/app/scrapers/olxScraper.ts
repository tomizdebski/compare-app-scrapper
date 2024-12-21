// app/scrapers/olxScraper.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export interface Product {
  title: string;
  price: string;
  link: string;
}

// Użycie pluginu stealth, aby uniknąć detekcji botów
puppeteer.use(StealthPlugin());

export async function scrapeOLX(query: string): Promise<Product[]> {
  //const searchUrl = `${process.env.OLX_SEARCH_URL}${encodeURIComponent(query)}/`;
  const searchUrl = `https://www.olx.pl/oferty/q-${encodeURIComponent(query)}`;

  try {
    const browser = await puppeteer.launch({
      headless: true, // Ustaw na false, aby zobaczyć przeglądarkę podczas debugowania
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Rotacja User-Agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
      // Dodaj więcej User-Agentów według potrzeb
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    console.log(`Navigating to ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Poczekaj, aż elementy ofert będą widoczne
    await page.waitForSelector('div.listing-grid-container', { timeout: 10000 });

    const products: Product[] = await page.evaluate(() => {
      const items = document.querySelectorAll('div.offer-wrapper');
      const results: Product[] = [];

      items.forEach((item) => {
        const titleElement = item.querySelector('strong.title');
        const priceElement = item.querySelector('p.price strong');
        const linkElement = item.querySelector('a.detailsLink');

        const title = titleElement ? titleElement.textContent?.trim() || '' : '';
        const price = priceElement ? priceElement.textContent?.trim() || '' : '';
        const link = linkElement ? (linkElement as HTMLAnchorElement).href : '';

        if (title && price && link) {
          results.push({ title, price, link });
        }
      });

      return results;
    });

    await browser.close();
    console.log(`Extracted ${products.length} products from OLX`);
    return products;
  } catch (error) {
    console.error('Error scraping OLX:', error);
    return [];
  }
}
