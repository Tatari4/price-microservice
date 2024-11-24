import { Controller, Get } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/btc')
  async getBitcoinPrice() {
    return this.priceService.getBitcoinPrice();
  }
}
