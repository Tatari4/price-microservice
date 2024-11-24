export type TPriceResponse = {
  ask: string;
  bid: string;
  avgPrice: string;
};

export type TPriceCache = TPriceResponse & {
  lastUpdatedAt: number;
};
