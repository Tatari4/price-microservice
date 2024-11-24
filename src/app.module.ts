import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PriceModule } from './price/price.module';
import { BinanceModule } from './binance/binance.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PriceModule,
    BinanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
