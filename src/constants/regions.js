/**
 * Regional constants for the Afghan Folklore Archive
 * These are the 34 provinces of Afghanistan in English transliteration
 * The field name remains "region" for database compatibility
 */

export const REGIONS = [
  "Badakhshan",
  "Badghis",
  "Baghlan",
  "Balkh",
  "Bamyan",
  "Daykundi",
  "Farah",
  "Faryab",
  "Ghazni",
  "Ghor",
  "Helmand",
  "Herat",
  "Jawzjan",
  "Kabul",
  "Kandahar",
  "Kapisa",
  "Khost",
  "Kunar",
  "Kunduz",
  "Laghman",
  "Logar",
  "Nangarhar",
  "Nimruz",
  "Nuristan",
  "Paktia",
  "Paktika",
  "Panjshir",
  "Parwan",
  "Samangan",
  "Sar-e Pol",
  "Takhar",
  "Urozgan",
  "Wardak",
  "Zabul",
];

export const REGION_DESCRIPTIONS = REGIONS.map((province) => ({
  name: province,
  description: `${province} Province`,
}));
