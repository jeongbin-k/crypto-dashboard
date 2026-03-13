import { useState, useEffect } from "react";

function useFavorites() {
  // localStorage에서 초기값 읽어오기
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // favorites 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 즐겨찾기 추가/제거 토글
  const toggleFavorite = (id: string) => {
    setFavorites(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // 있으면 제거
          : [...prev, id], // 없으면 추가
    );
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (id: string): boolean => {
    return favorites.includes(id);
  };

  return { favorites, toggleFavorite, isFavorite };
}

export default useFavorites;
