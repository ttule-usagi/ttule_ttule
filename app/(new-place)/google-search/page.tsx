'use client';

import Sidebar from '@/components/layouts/Sidebar';
import React, { useState } from 'react';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 검색 버튼을 누르거나 엔터를 쳤을 때 딱 한 번 실행되는 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지

    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await response.json();

      // 결과가 있을 때만 셋팅
      setResults(data.places || []);
    } catch (error) {
      console.error('검색 중 에러 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=''>
      <Sidebar />
      <div className='h-screen bg-line-pattern bg-brand-blue-50 ml-[64px]  max-w-102 mx-auto p-4'>
        {/* 검색 폼 */}
        <form
          onSubmit={handleSearch}
          className='flex gap-2'
        >
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='장소를 검색하세요 (예: 하나다코)'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-brand-gray-0'
          />
          <button
            type='submit'
            disabled={isLoading}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </form>

        {/* 결과 리스트 */}
        <div className='mt-4 space-y-2'>
          {results.length > 0
            ? results.map((place: any) => (
                <div
                  key={place.id}
                  className='p-3 border border-gray-100 rounded-lg shadow-sm bg-brand-gray-0 hover:bg-gray-50 cursor-pointer '
                  onClick={() => console.log('선택됨:', place)}
                >
                  <div className='typo-sub-title text-brand-blue-700 '>{place.displayName?.text}</div>
                  <div className='text-xs text-gray-500 '>
                    {place.primaryTypeDisplayName?.text} · {place.shortFormattedAddress}
                  </div>
                </div>
              ))
            : !isLoading && query && <p className='text-sm text-gray-400 text-center'>검색 결과가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}
