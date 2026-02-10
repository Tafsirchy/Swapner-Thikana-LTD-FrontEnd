/**
 * Simple environment-aware logger utility.
 * In production, technical details are suppressed or simplified.
 */

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args) => {
    if (!isProd) {
      console.log(...args);
    }
  },
  
  info: (...args) => {
    if (!isProd) {
      console.info(...args);
    }
  },
  
  warn: (...args) => {
    if (isProd) {
      // In production, we log a simplified message if it's high priority
      // Usually, warnings are skipped to keep the console clean
      return;
    }
    console.warn(...args);
  },
  
  error: (message, technicalDetails = null) => {
    if (isProd) {
      // Log only the message to the console in production
      // In a real app, this is where you'd send technicalDetails to Sentry/LogRocket
      console.error(`[Error] ${message}`);
    } else {
      // In development, log everything
      if (technicalDetails && Object.keys(technicalDetails).length > 0) {
        console.error(`[Error] ${message}`, technicalDetails);
      } else {
        console.error(`[Error] ${message}`);
      }
    }
  }
};

export default logger;
