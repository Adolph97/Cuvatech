import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiFileArgument = process.argv.slice(2).find((argument) => argument !== '--');
const apiPath = path.resolve(rootDir, apiFileArgument || 'public/api.php');
const requiredFields = [
  'stripePublishableKey',
  'paypalClientId',
  'paymentMode',
  'deliveryFee',
  'premiumDeliveryFee',
  'premiumClients'
];
const requiredProductFields = [
  'basePrice',
  'minOrderWeightKg',
  'weightPerUnitKg'
];
const endpoint = process.env.PRODUCTION_API_URL;

let missingFields;

if (endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`PHP public settings API returned ${response.status}.`);
  }

  const settings = await response.json();
  missingFields = requiredFields.filter((field) => !(field in settings));
} else {
  const apiSource = fs.readFileSync(apiPath, 'utf8');
  const routeStart = apiSource.indexOf("// Route: settings/public");
  const routeEnd = apiSource.indexOf("// Route: products", routeStart);

  if (routeStart === -1 || routeEnd === -1) {
    throw new Error('Could not locate the PHP public settings route.');
  }

  const publicSettingsRoute = apiSource.slice(routeStart, routeEnd);
  missingFields = requiredFields.filter(
    (field) => !publicSettingsRoute.includes(`"${field}"`)
  );
}

if (missingFields.length > 0) {
  throw new Error(
    `PHP public settings API is missing required fields: ${missingFields.join(', ')}`
  );
}

if (!endpoint) {
  const apiSource = fs.readFileSync(apiPath, 'utf8');
  const productsRouteStart = apiSource.indexOf("// Route: products");
  const productsRouteEnd = apiSource.indexOf("// Route: orders", productsRouteStart);

  if (productsRouteStart === -1 || productsRouteEnd === -1) {
    throw new Error('Could not locate the PHP products routes.');
  }

  const productsRoutes = apiSource.slice(productsRouteStart, productsRouteEnd);
  const missingProductFields = requiredProductFields.filter(
    (field) => !productsRoutes.includes(field)
  );

  if (missingProductFields.length > 0) {
    throw new Error(
      `PHP products API is missing required fields: ${missingProductFields.join(', ')}`
    );
  }

  // Portfolio route must contain the required field marker `title`
  const portfolioRouteStart = apiSource.indexOf('// Route: portfolio');
  const portfolioRouteEnd = apiSource.indexOf('// Route: blog', portfolioRouteStart);
  if (portfolioRouteStart !== -1 && portfolioRouteEnd !== -1) {
    const portfolioRoutes = apiSource.slice(portfolioRouteStart, portfolioRouteEnd);
    const missingPortfolioFields = ['title'].filter((field) => !portfolioRoutes.includes(field));
    if (missingPortfolioFields.length > 0) {
      throw new Error(
        `PHP portfolio API is missing required fields: ${missingPortfolioFields.join(', ')}`
      );
    }
  }

  // Blog route must contain the required field marker `content`
  const blogRouteStart = apiSource.indexOf('// Route: blog');
  const blogRouteEnd = apiSource.indexOf('// Route: site-info', blogRouteStart);
  if (blogRouteStart !== -1 && blogRouteEnd !== -1) {
    const blogRoutes = apiSource.slice(blogRouteStart, blogRouteEnd);
    const missingBlogFields = ['content'].filter((field) => !blogRoutes.includes(field));
    if (missingBlogFields.length > 0) {
      throw new Error(
        `PHP blog API is missing required fields: ${missingBlogFields.join(', ')}`
      );
    }
  }

  // Site-info route must contain the required field marker `phone`
  const siteInfoRouteStart = apiSource.indexOf('// Route: site-info');
  if (siteInfoRouteStart !== -1) {
    const siteInfoRoutes = apiSource.slice(siteInfoRouteStart);
    const missingSiteInfoFields = ['phone'].filter((field) => !siteInfoRoutes.includes(field));
    if (missingSiteInfoFields.length > 0) {
      throw new Error(
        `PHP site-info API is missing required fields: ${missingSiteInfoFields.join(', ')}`
      );
    }
  }
}

console.log('PHP public settings API contract is complete.');
