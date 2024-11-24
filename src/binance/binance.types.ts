export type TBinanceConfig = {
  symbols: TSymbol[];
  precision: number;
};

export type TSymbol = {
  symbol: string;
};

export type TBookTickerResponse = {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
};
