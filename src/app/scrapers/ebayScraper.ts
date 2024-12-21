// app/scrapers/ebayScraper.ts

import axios from 'axios';
import * as cheerio from 'cheerio';

export interface Product {
  title: string;
  price: string;
  link: string;
}

export async function scrapeEbay(query: string): Promise<Product[]> {
  const searchUrl = `${process.env.EBAY_SEARCH_URL}${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0',
      },
    });
    const $ = cheerio.load(data);
    const products: Product[] = [];

    $('.s-item').each((_, element) => {
      const title = $(element).find('.s-item__title').text().trim();
      const price = $(element).find('.s-item__price').text().trim();
      const link = $(element).find('.s-item__link').attr('href') || '';

      if (title && price && link) {
        products.push({ title, price, link });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping eBay:', error);
    return [];
  }
}
