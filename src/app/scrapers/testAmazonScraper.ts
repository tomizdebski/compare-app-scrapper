// app/scrapers/testAmazonScraper.ts

import { scrapeAmazon } from './amazonScraper';

(async () => {
  const query = 'laptop';

  console.log(`Testing Amazon scraper with query: "${query}"\n`);

  console.log('Scraping Amazon...');
  const amazonProducts = await scrapeAmazon(query);
  console.log(`Amazon Products:`, amazonProducts);
})();
