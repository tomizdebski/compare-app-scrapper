// app/scrapers/allegroScraper.ts

import puppeteer from 'puppeteer';
export interface Product {
  title: string;
  price: string;
  link: string;
}

export async function scrapeAllegro(query: string): Promise<Product[]> {
  const searchUrl = `${process.env.ALLEGRO_SEARCH_URL}${encodeURIComponent(query)}`;

  try {
    const browser = await puppeteer.launch({
      headless: true, // Ustaw na false, jeśli chcesz zobaczyć przeglądarkę
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Ustawienie User-Agent
    await page.setUserAgent(process.env.USER_AGENT || 'Mozilla/5.0');

    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Opcjonalnie, możesz dodać więcej interakcji, np. przewijanie strony

    const products: Product[] = await page.evaluate(() => {
      const items = document.querySelectorAll('.opbox-listing .opbox-listing-item');
      const results: Product[] = [];

      items.forEach((item) => {
        const titleElement = item.querySelector('.opbox-listing-item-title');
        const priceElement = item.querySelector('.opbox-listing-item-price .opbox-listing-item-price__price');
        const linkElement = item.querySelector('a');

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
    return products;
  } catch (error) {
    console.error('Error scraping Allegro:', error);
    return [];
  }
}
