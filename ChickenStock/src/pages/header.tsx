import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenMyPage: () => void;
}

export default function Header({ isLoggedIn, onLogout, onOpenLogin, onOpenMyPage }: HeaderProps) {
  return (
    <header className="header">
      {/* 서비스 로고 */}
      <div className="logo-box">Chickenstock</div>
      
      {/* 우측 상단 버튼 그룹 */}
      <div className="header-buttons">
        {isLoggedIn ? (
          <>
            <button className="btn-pill" onClick={onOpenMyPage}>MyPage</button>
            <button className="btn-pill" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="btn-pill" onClick={onOpenLogin}>Login</button>
        )}
      </div>
    </header>
  );
}