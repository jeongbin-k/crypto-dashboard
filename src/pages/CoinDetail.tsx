import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoinDetail } from "../api/coinGecko";
import type { CoinDetail as CoinDetailType } from "../types/coin";

function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await getCoinDetail(id!);
        setCoin(data);
      } catch (err) {
        console.log(err);
        setError("데이터를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const price = coin.market_data.current_price.krw;
  const change24h = coin.market_data.price_change_percentage_24h ?? 0;
  const change7d = coin.market_data.price_change_percentage_7d ?? 0;
  const marketCap = coin.market_data.market_cap.krw;
  const volume = coin.market_data.total_volume.krw;
  const high24h = coin.market_data.high_24h.krw;
  const low24h = coin.market_data.low_24h.krw;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-blue-400 cursor-pointer hover:text-blue-300"
          >
            CoinScope
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← 목록으로
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 코인 기본 정보 */}
        <div className="flex items-center gap-4 mb-8">
          <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
          <div>
            <h2 className="text-3xl font-bold">{coin.name}</h2>
            <p className="text-gray-400 uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* 가격 */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">현재가</p>
          <p className="text-4xl font-bold mb-3">₩{price.toLocaleString()}</p>
          <div className="flex gap-4">
            <span
              className={`text-sm ${change24h >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              24h {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}%
            </span>
            <span
              className={`text-sm ${change7d >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              7d {change7d >= 0 ? "+" : ""}
              {change7d.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 시장 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "시가총액", value: `₩${marketCap.toLocaleString()}` },
            { label: "거래량 (24h)", value: `₩${volume.toLocaleString()}` },
            { label: "24h 고가", value: `₩${high24h.toLocaleString()}` },
            { label: "24h 저가", value: `₩${low24h.toLocaleString()}` },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 설명 */}
        {coin.description.en && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-3">소개</p>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-5">
              {coin.description.en.replace(/<[^>]+>/g, "")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CoinDetail;
