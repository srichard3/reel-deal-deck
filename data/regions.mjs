/**
 * data/regions.mjs — the states and provinces the form offers.
 *
 * ONE source of truth, imported by the page that renders the <select> and by
 * netlify/functions/wholesale-apply.mjs that re-checks the submission. A typed
 * free-text state was the problem this replaces: "Idaho" happens to work
 * because Shopify normalises full names, but a typo like "Idho" fails
 * customerCreate with "Province is invalid", which reaches the applicant as
 * "something went wrong setting up the account" — unactionable, for a typo.
 *
 * Codes are Shopify's provinceCode values. Order is alphabetical by name,
 * because that is how someone scans a list looking for their own state.
 */
export const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'],
  ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'],
  ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
  ['PR', 'Puerto Rico'], ['VI', 'U.S. Virgin Islands'], ['AE', 'Armed Forces (AE)'],
  ['AP', 'Armed Forces (AP)'], ['AA', 'Armed Forces (AA)'],
];

export const CA_PROVINCES = [
  ['AB', 'Alberta'], ['BC', 'British Columbia'], ['MB', 'Manitoba'],
  ['NB', 'New Brunswick'], ['NL', 'Newfoundland and Labrador'],
  ['NT', 'Northwest Territories'], ['NS', 'Nova Scotia'], ['NU', 'Nunavut'],
  ['ON', 'Ontario'], ['PE', 'Prince Edward Island'], ['QC', 'Quebec'],
  ['SK', 'Saskatchewan'], ['YT', 'Yukon'],
];

export const REGIONS = { US: US_STATES, CA: CA_PROVINCES };

/* Shopify accepts garbage in zip (tested: "abc" and "1" both saved without
   complaint), so this is the only thing standing between a typo and a parcel
   that cannot be delivered. US: five digits, optionally ZIP+4. CA: the
   A1A 1A1 pattern, space optional. */
export const POSTAL = {
  US: { re: /^\d{5}(-\d{4})?$/, hint: 'A 5-digit ZIP, like 83616.' },
  CA: { re: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, hint: 'A postal code like K1A 0B1.' },
};

export function isValidRegion(country, code) {
  const list = REGIONS[String(country || '').toUpperCase()];
  if (!list) return false;
  return list.some(([c]) => c === String(code || '').toUpperCase());
}

export function isValidPostal(country, value) {
  const spec = POSTAL[String(country || '').toUpperCase()];
  if (!spec) return true;
  return spec.re.test(String(value || '').trim());
}
