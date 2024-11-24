import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TBookTickerResponse, TSymbol } from './binance.types';

@Injectable()
export class BinanceClient {
  private readonly apiUrl: string;
  private readonly symbols: TSymbol[];
  private readonly logger = new Logger(BinanceClient.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('binance.apiUrl');
    this.symbols = this.configService.get<TSymbol[]>('binance.symbols');
  }

  async fetchTickers(): Promise<TBookTickerResponse[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          this.apiUrl +
            `/v3/ticker/bookTicker?symbols=${JSON.stringify(this.symbols.map((x) => x.symbol))}`,
        ),
      );
      return response.data;
    } catch (e) {
      this.logger.error('Error when fetching tickers: ' + e);
      return [];
    }
  }
}
