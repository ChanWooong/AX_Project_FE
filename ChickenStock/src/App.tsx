import React, { useState } from 'react';
import Header from './pages/header';
import MainBoard from './pages/mainboard';

export default function App() {
  // 메인 화면에 띄울 주식 정보를 관리하는 상태입니다.
  const [currentStock, setCurrentStock] = useState({
    name: "삼성전자",
    rate: "-5.29%"
  });

  return (
    <div className="app-container">
      <div className="white-background">
        {/* 로그인 로직을 제외했으므로, 임시로 alert 창을 띄우는 함수를 전달합니다.
          이렇게 하면 HeaderProps의 타입 규칙을 어기지 않아 에러가 나지 않습니다. 
        */}
        <Header onOpenLogin={() => alert('로그인 기능은 준비 중입니다.')} />
        
        {/* MainBoard 컴포넌트에 현재 주식 정보를 Props로 건네줍니다. */}
        <MainBoard 
          stockName={currentStock.name} 
          changeRate={currentStock.rate} 
        />
      </div>
    </div>
  );
}