import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoins } from "../api/coinGecko";
import type { Coin } from "../types/coin";
import useFavorites from "../hooks/useFavorites";
import { Heart } from "lucide-react";
import { Header } from "../compoents/Header";

function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

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
      <Header />
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
              {/* 왼쪽 - 코인 정보 */}
              <div className="flex items-center gap-4">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <p className="font-semibold">{coin.name}</p>
                  <p className="text-gray-400 text-sm uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              {/* 오른쪽 - 가격 + 즐겨찾기 묶음 */}
              <div className="flex items-center gap-4">
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(coin.id);
                  }}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Heart
                    size={18}
                    className={
                      isFavorite(coin.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500"
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
