import React, { useState } from 'react';
import axios from 'axios';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void; 
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  
  // 백엔드 SignUpDto / SignInDto 규격에 맞춘 State
  const [id, setId] = useState<string>(''); 
  const [name, setName] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>(''); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoginView && password !== checkPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 환경변수가 없으면 기본 백엔드 EC2 주소 사용
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://13.209.15.204:8080'; 

      if (isLoginView) {
        // [로그인 요청] -> 백엔드의 MemberController.login() 호출
        const response = await axios.post(`${baseURL}/api/login`, {
          id: id, 
          password: password,
        });
        
        // 💡 백엔드 ResponseDto 구조 반영: response.data가 ResponseDto임
        // 백엔드는 정상 성공 시 토큰을 객체 안에 담아 보냅니다.
        const responseData = response.data;
        
        // ResponseDto의 필드나 TokenInfo의 accessToken 필드 매핑 검증
        const token = responseData?.accessToken || responseData?.data?.accessToken; 
        const grantType = responseData?.grantType || responseData?.data?.grantType || 'Bearer';
        
        if (!token) {
          alert('ID 혹은 비밀번호가 틀렸거나, 인증에 실패했습니다.');
          return;
        }

        // 이후 Authorization 헤더 보낼 때 표준 포맷인 "Bearer 토큰값" 형태로 보관하거나 
        // 기존 규격대로 저장하려면 token 값만 깔끔하게 보관합니다.
        localStorage.setItem('accessToken', token);
        
        alert('로그인 성공!');
        onLoginSuccess(); 
        onClose(); 

      } else {
        // [회원가입 요청] -> 백엔드의 MemberController.join() 호출
        await axios.post(`${baseURL}/api/join`, {
          id: id,
          name: name,
          password: password,
          checkPassword: checkPassword
        });

        alert('회원가입이 완료되었습니다. 로그인해주세요!');
        setIsLoginView(true); 
        setId('');
        setName('');
        setPassword('');
        setCheckPassword('');
      }
    } catch (error: any) {
      console.error("인증 에러 상세:", error);
      
      // 서버가 보내준 에러 메시지가 있다면 출력, 없으면 기본 메시지 출력
      const serverMessage = error.response?.data?.message;
      if (isLoginView) {
        alert(serverMessage || '로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.');
      } else {
        alert(serverMessage || '회원가입에 실패했습니다. 입력 양식을 다시 확인해주세요.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoginView ? (
          // --- 로그인 화면 ---
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Login</h2>
              <button type="button" className="btn-small" onClick={() => setIsLoginView(false)}>
                sign-up
              </button>
            </div>
            <div className="input-group">
              <label>학번 (ID)</label>
              <input 
                type="text" 
                placeholder="학번을 입력하세요" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">login</button>
          </form>
        ) : (
          // --- 회원가입 화면 ---
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Sign-up</h2>
              <button type="button" className="btn-small" onClick={() => setIsLoginView(true)}>
                back to login
              </button>
            </div>
            <div className="input-group">
              <label>학번 (ID)</label>
              <input 
                type="text" 
                placeholder="학번을 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>이름</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>비밀번호</label>
              <input 
                type="password"
                placeholder="비밀번호를 설정하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="pwd-hint">
                최소 6자 이상, 영문 대소문자 및 숫자를 포함해야 합니다.
              </span>
            </div>
            <div className="input-group">
              <label>비밀번호 확인</label>
              <input 
                type="password"
                placeholder="비밀번호를 다시 한 번 입력하세요"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">register</button>
          </form>
        )}
      </div>
    </div>
  );
}