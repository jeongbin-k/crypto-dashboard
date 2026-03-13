import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoins } from "../api/coinGecko";
import type { Coin } from "../types/coin";

function Home() {
  // 코인 데이터 저장할 공간
  const [coins, setCoins] = useState<Coin[]>([]);
  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);
  // 검색 기능
  const [search, setSearch] = useState<string>("");

  // 페이지 이동 담당
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins();
        setCoins(data);
      } catch (err) {
        console.log(err);
        setError("데이터를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-400">CoinScope</h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <span className="cursor-pointer hover:text-white">Home</span>
            <span className="cursor-pointer hover:text-white">Favorites</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">암호화폐 시장</h2>
        <p className="text-gray-400 text-sm mb-4">
          실시간 암호화폐 시세를 확인하세요
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="코인 이름 또는 심볼 검색 (예: bitcoin, btc)"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-6"
        />

        <div className="flex flex-col gap-3">
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className="flex items-center justify-between bg-gray-900 rounded-xl px-6 py-4 hover:bg-gray-800 cursor-pointer transition"
            >
              <div className="flex items-center gap-4">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <p className="text-gray-400 text-sm uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₩{coin.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    (coin.price_change_percentage_24h ?? 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}
                  {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
