export function Header() {
  return (
    <header className="border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CoinScope</h1>
        <nav className="flex gap-4 text-sm text-gray-400">
          <span className="cursor-pointer hover:text-white">Home</span>
          <span className="cursor-pointer hover:text-white">Favorites</span>
        </nav>
      </div>
    </header>
  );
}
