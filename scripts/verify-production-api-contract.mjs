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
  'minOrderWeightKg',
  'premiumClients'
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

console.log('PHP public settings API contract is complete.');
