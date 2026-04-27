'use client';

/**
 * [공통 버튼 컴포넌트]
 * props:
 * - width: 버튼의 너비 (예: "w-full", "w-auto", "w-1/2" 등)
 * - height: 버튼의 높이 (예: "h-10", "h-auto" 등)
 * - bgColor: 버튼의 배경색 (예: "bg-blue-500", "bg-red-500" 등)
 * - textColor: 버튼의 글자색 (예: "text-white", "text-black" 등)
 * - text: 버튼에 표시될 텍스트
 * - onClick: 버튼 클릭 시 실행될 함수
 */

interface ButtonProps {
  width?: string;
  height?: string;
  bgColor?: string;
  textColor?: string;
  padding?: string;
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick, width, height, bgColor, textColor, padding }: ButtonProps) {
  return (
    <button
      className={`${width || "w-auto"} ${height || "h-auto"} ${bgColor || "bg-white"} ${textColor || "text-black"} ${padding || "px-2.5 py-2.5"} rounded-md`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}