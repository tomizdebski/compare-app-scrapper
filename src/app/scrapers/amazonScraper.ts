// app/scrapers/amazonScraper.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export interface Product {
  title: string;
  price: string;
  link: string;
}

// Użycie pluginu stealth, aby uniknąć detekcji botów
puppeteer.use(StealthPlugin());

export async function scrapeAmazon(query: string): Promise<Product[]> {
  const searchUrl = `https://www.amazon.pl/s?k=${encodeURIComponent(query)}`;

  try {
    const browser = await puppeteer.launch({
      headless: false, // Ustaw na true po zakończeniu debugowania
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
      ],
    });
    const page = await browser.newPage();

    // Rotacja User-Agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
      // Dodaj więcej User-Agentów według potrzeb
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    // Przechwytywanie logów z przeglądarki
    page.on('console', (msg) => {
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`PAGE LOG: ${msg.args()[i]}`);
    });

    console.log(`Navigating to ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Opcjonalnie: Przewinięcie strony, aby załadować więcej wyników
    // await autoScroll(page);

    // Poczekaj, aż elementy ofert będą widoczne
    await page.waitForSelector('div.s-main-slot', { timeout: 15000 });

    const products: Product[] = await page.evaluate(() => {
      const items = document.querySelectorAll('div[data-component-type="s-search-result"]');
      const results: Product[] = [];
    
      items.forEach((item) => {
        // Wyciągnięcie tytułu
        const titleElement = item.querySelector('div[data-cy="title-recipe"] h2 > span');
        const title = titleElement ? titleElement.textContent?.trim() || '' : '';
    
        // Wyciągnięcie linku
        const linkElement = item.querySelector('div[data-cy="title-recipe"] a');
        let link = linkElement ? (linkElement as HTMLAnchorElement).href : '';
        // Jeśli link jest względny, dodaj domenę Amazon
        if (link.startsWith('/')) {
          link = `https://www.amazon.pl${link}`;
        }
    
        // Wyciągnięcie ceny
        const wholePriceElement = item.querySelector('span.a-price-whole');
        const fractionPriceElement = item.querySelector('span.a-price-fraction');
        const price = wholePriceElement && fractionPriceElement
          ? `${wholePriceElement.textContent?.trim() || ''}.${fractionPriceElement.textContent?.trim() || ''} zł`
          : 'Brak ceny';
    
        if (title && link) {
          results.push({ title, price, link });
        }
      });
    
      return results;
    });

    await browser.close();
    console.log(`Extracted ${products.length} products from Amazon`);
    return products;
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return [];
  }
}



