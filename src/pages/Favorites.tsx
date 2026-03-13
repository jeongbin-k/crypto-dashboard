import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoins } from "../api/coinGecko";
import type { Coin } from "../types/coin";
import useFavorites from "../hooks/useFavorites";
import { Heart } from "lucide-react";

function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins();
        // 즐겨찾기에 있는 코인만 필터링
        const favoriteCoins = data.filter((coin) =>
          favorites.includes(coin.id),
        );
        setCoins(favoriteCoins);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-blue-400 cursor-pointer hover:text-blue-300"
          >
            CoinScope
          </h1>
          <nav className="flex gap-4 text-sm text-gray-400">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-white"
            >
              홈
            </span>
            <span className="text-white cursor-pointer">즐겨찾기</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">즐겨찾기</h2>
        <p className="text-gray-400 text-sm mb-6">
          내가 저장한 코인 목록이에요
        </p>

        {/* 즐겨찾기 없을 때 */}
        {coins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <p className="text-4xl mb-4">☆</p>
            <p className="text-sm">아직 즐겨찾기한 코인이 없어요</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-blue-400 text-sm hover:text-blue-300 transition"
            >
              코인 목록 보러가기 →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {coins.map((coin) => (
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

                <div className="flex items-center gap-6">
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
                    className="text-xl hover:scale-110 transition-transform"
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
        )}
      </main>
    </div>
  );
}

export default Favorites;
