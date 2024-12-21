// app/scrapers/testAmazonScraper.ts
import dotenv from 'dotenv';
dotenv.config();
import { scrapeOLX } from './olxScraper';

(async () => {
  const query = 'laptop';

  console.log(`Testing OLX scraper with query: "${query}"\n`);

  console.log('Scraping OLX...');
  const olxProducts = await scrapeOLX(query);
  console.log(`OLX Products:`, olxProducts);
})();