import axios from 'axios';

import { API_URL } from '@/config/api';

const browserLang = navigator?.language;
const supportedLocales = ['en', 'ru'];
// fallback to 'ru-RU' if the browser's language is not supported
let detectedLocale = 'ru';

if (supportedLocales.includes(browserLang)) {
  detectedLocale = browserLang;
}

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': detectedLocale,
    Accept: 'application/json',
  },
  timeout: 10000,
});

export default instance;
