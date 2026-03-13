// CoinGecko API가 돌려주는 데이터 구조를 TS로 정의

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number; // 현재가
  price_change_percentage_24h: number | null; // 24시간 변동률
  market_cap: number; // 시가총액
  total_volume: number; // 거래량
}

export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    current_price: {
      krw: number;
    };
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    market_cap: {
      krw: number;
    };
    total_volume: {
      krw: number;
    };
    high_24h: {
      krw: number;
    };
    low_24h: {
      krw: number;
    };
  };
}
