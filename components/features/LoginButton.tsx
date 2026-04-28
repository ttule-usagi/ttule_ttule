'use client';

export default function LoginButton() {
  const handleLogin = () => {
    alert("로그인 버튼이 클릭되었습니다.");
  }

  return (
    <button className="text-typo-title bg-brand-gray-50 text-brand-blue-700 border border-brand-blue-200 rounded-lg h-13 w-66" onClick={handleLogin}>
      로그인
    </button>
  )
}