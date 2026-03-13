import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CoinScope</h1>
        <nav className="flex gap-4 text-sm text-gray-400">
          <span className="text-white cursor-pointer">홈</span>
          <span
            onClick={() => navigate("/favorites")}
            className="cursor-pointer hover:text-white"
          >
            즐겨찾기
          </span>
        </nav>
      </div>
    </header>
  );
}
