'use client';

import Button from "@/components/common/Button";

export default function LoginButton() {
  const handleLogin = () => {
    alert("로그인 버튼이 클릭되었습니다.");
  }

  return (
    <Button text="로그인" bgColor="bg-brand-gray-50" textColor="text-brand-blue-700" width="w-[264px]" height="h-[52px]" padding="px-9 py-2.5" onClick={handleLogin} />
  )
}