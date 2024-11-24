import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { BinanceModule } from 'src/binance/binance.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [BinanceModule, CacheModule.register()],
  providers: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {}
