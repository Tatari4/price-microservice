import Decimal from 'decimal.js';
import { BINANCE_CONFIG } from 'src/binance/binance.config';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  service: {
    priceUpdateInterval:
      parseInt(process.env.SERVICE_PRICE_UPDATE_INTERVAL) || 10,
    commission:
      new Decimal(process.env.SERVICE_COMMISSION) || new Decimal(0.01),
  },
  binance: {
    apiUrl: process.env.BINANCE_API_URL || 'https://api.binance.com',
    ...BINANCE_CONFIG,
  },
});
