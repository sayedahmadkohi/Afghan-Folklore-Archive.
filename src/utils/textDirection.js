/**
 * Returns the text direction based on the language
 * @param {string} language - The language code or name
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getTextDirection = (language) => {
  if (!language) return 'ltr';
  
  const rtlLanguages = ['Dari', 'Persian', 'fa', 'Pashto', 'ps', 'Arabic', 'ar', 'Uzbek', 'uz'];
  const normalizedLanguage = language.toLowerCase();
  
  return rtlLanguages.some(lang => normalizedLanguage.includes(lang.toLowerCase())) ? 'rtl' : 'ltr';
};

/**
 * Checks if a language is RTL
 * @param {string} language - The language code or name
 * @returns {boolean}
 */
export const isRTL = (language) => {
  return getTextDirection(language) === 'rtl';
};
