import axios from "axios";
import type { Coin } from "../types/coin";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API_KEY,
  },
});

// 코인 목록 가져오는 함수
export const getCoins = async (): Promise<Coin[]> => {
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: "krw", // 원화 기준
      order: "market_cap_desc", // 시가총액 순 정렬
      per_page: 50, // 50개
      page: 1,
      sparkline: false,
    },
  });
  return data;
};

export default api;
