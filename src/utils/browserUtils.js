/**
 * Utility functions for browser and device detection
 */

/**
 * Detects if the current browser is an embedded WebView (in-app browser)
 * such as Facebook, Instagram, LinkedIn, Line, or Apple Mail.
 * 
 * Google OAuth explicitly blocks these environments with a 403 disallowed_useragent error.
 * 
 * @returns {boolean} True if running inside a known embedded browser
 */
export const isEmbeddedBrowser = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

  // Regex to match common in-app browsers
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari)',
    'Android.*(wv|.0.0.0)',
    'Linux; U; Android',
    'FBAN', // Facebook App
    'FBAV', // Facebook App Version
    'Instagram',
    'LinkedInApp',
    'Snapchat',
    'Twitter',
    'Line',
    'Viber',
    'WhatsApp',
    'Pinterest',
    'FBIOS',
    'GSA\\/', // Google Search App on iOS
    'Gmail',  // Gmail App
    'MicroMessenger', // WeChat
  ];

  const regex = new RegExp(`(${rules.join('|')})`, 'ig');
  
  return regex.test(userAgent);
};
