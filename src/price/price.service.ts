import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import { BinanceClient } from 'src/binance/binance.client';
import { TBookTickerResponse } from 'src/binance/binance.types';
import { TPriceCache, TPriceResponse } from './price.types';

@Injectable()
export class PriceService {
  private readonly updateInterval: number;
  private readonly commission: Decimal;
  private readonly precision: number;
  private readonly logger = new Logger(PriceService.name);
  constructor(
    private readonly binanceClient: BinanceClient,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.updateInterval = this.configService.get<number>(
      'service.priceUpdateInterval',
    );
    this.commission = this.configService.get<Decimal>('service.commission');
    this.precision = this.configService.get<number>('binance.precision');

    this.startPriceUpdater();
  }

  private async startPriceUpdater() {
    setInterval(async () => {
      const tickers = await this.binanceClient.fetchTickers();
      for (const ticker of tickers) {
        const priceData = this.calculatePriceWithCommission(ticker);

        const priceCache: TPriceCache = {
          ...priceData,
          lastUpdatedAt: new Date().getTime(),
        };

        await this.cacheManager.set(ticker.symbol, priceCache);
        this.logger.debug(
          `Cached price for: ${ticker.symbol} at ${priceCache.lastUpdatedAt}`,
        );
      }
    }, this.updateInterval * 1000);
  }

  /* Средняя цена не является точной, так как не хвтает данных по объемам торгов за определенный временной промежуток */
  private calculatePriceWithCommission(
    ticker: TBookTickerResponse,
  ): TPriceResponse {
    const bid = new Decimal(ticker.bidPrice);
    const ask = new Decimal(ticker.askPrice);

    const bidWithCommission = bid.mul(Decimal.sub(1, this.commission));
    const askWithCommission = ask.mul(Decimal.add(1, this.commission));

    const avgPrice = bidWithCommission.add(askWithCommission).div(2);

    return {
      bid: bidWithCommission.toFixed(this.precision),
      ask: askWithCommission.toFixed(this.precision),
      avgPrice: avgPrice.toString(),
    };
  }

  async getBitcoinPrice(): Promise<TPriceResponse> {
    const priceData = await this.cacheManager.get<TPriceCache>('BTCUSDT');

    if (!priceData) {
      throw new InternalServerErrorException('No price data for BTC');
    }

    return {
      ask: priceData.ask,
      bid: priceData.bid,
      avgPrice: priceData.avgPrice,
    };
  }
}
