import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoinDetail, getCoinChart } from "../api/coinGecko";
import type { CoinDetail as CoinDetailType } from "../types/coin";
import useFavorites from "../hooks/useFavorites";
import { Heart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 기간 버튼 옵션
const PERIODS = [
  { label: "1d", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

interface ChartData {
  date: string;
  price: number;
}

function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  // 코인 상세 정보 (처음 한 번만)
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
  }, [id, selectedDays]);

  // 차트 데이터 (기간 바뀔 때마다)
  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const raw = await getCoinChart(id!, selectedDays);

        // [timestamp, price] → { date, price } 변환
        const formatted = raw.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString("ko-KR", {
            month: "short",
            day: "numeric",
            ...(selectedDays === 1 && { hour: "2-digit", minute: "2-digit" }),
          }),
          price: Math.round(price),
        }));
        setChartData(formatted);
      } catch (err) {
        console.log(err);
        console.error("차트 데이터 오류");
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [id, selectedDays]); // selectedDays 바뀔 때마다 재호출

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

          {/* 즐겨찾기 버튼 */}
          <button
            onClick={() => toggleFavorite(coin.id)}
            className="text-3xl hover:scale-110 transition-transform"
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

        {/* 차트 */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          {/* 기간 선택 버튼 */}
          <div className="flex gap-2 mb-6">
            {PERIODS.map((period) => (
              <button
                key={period.days}
                onClick={() => setSelectedDays(period.days)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  selectedDays === period.days
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* 차트 */}
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400 text-sm">차트 불러오는 중...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={264}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₩${(v / 1000000).toFixed(0)}M`}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: unknown) => [
                    `₩${Number(value).toLocaleString()}`,
                    "가격",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
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
