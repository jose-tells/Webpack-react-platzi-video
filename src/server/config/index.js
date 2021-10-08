import dotenv from 'dotenv';

dotenv.config();

const {
  ENV,
  PORT,
  API_URL,
  API_KEY_TOKEN,
} = process.env;

export default {
  env: ENV,
  dev: process.env.NODE_ENV !== 'production',
  port: PORT || 8000,
  apiUrl: API_URL,
  apiKeyToken: API_KEY_TOKEN,
};
