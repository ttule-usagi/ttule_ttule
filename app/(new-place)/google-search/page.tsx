'use client';

import { Icon } from '@/components/common/Icon';
import GooglePlaceDetail from '@/components/features/search/GooglePlaceDetail';
import SearchInteraction from '@/components/features/search/SearchInteraction';
import SearchResultListItem from '@/components/features/search/SearchResultItem';
import Sidebar from '@/components/layouts/Sidebar';
import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import React, { useState } from 'react';

export default function SearchGoogle() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedGooglePlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 검색 버튼을 누르거나 엔터를 쳤을 때 딱 한 번 실행되는 함수
  const handleSearch = async (e: React.SubmitEvent) => {
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
      setHasSearched(true);
    } catch (error) {
      console.error('검색 중 에러 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceClick = async (place: any) => {
    try {
      const response = await fetch(`/api/google-search?placeId=${place.id}`);
      const additionalData = await response.json();
      console.log('추가정보 api요청');
      setSelectedPlace({ ...place, additionalData });
      setIsModalOpen(true);
    } catch (error) {
      console.log('구글 상세페이지용 정보 받아오기 중 에러 발생: ', error);
    } finally {
    }
  };

  // console.log('results: ', results);

  return (
    <div>
      <Sidebar />
      <div className='relative h-screen bg-line-pattern bg-brand-blue-50 ml-[64px]  max-w-102 mx-auto p-4 flex flex-col'>
        {/* 검색 폼 */}
        <div className='relative flex-shrink-0 flex flex-row items-center gap-4'>
          <Icon
            className='shrink-0'
            name='ArrowLeft'
            size={32}
          />
          <form
            onSubmit={handleSearch}
            className='flex gap-2 rounded-full w-full'
          >
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='구글 장소 검색'
              className=' flex-1 px-4 py-2 border-2 border-brand-blue-700 rounded-full outline-none focus:border-blue-500 bg-brand-gray-0 text-typo-base'
            />
            <div className='absolute top-[5px] right-3 rounded-lg flex items-center'>
              {query !== '' && (
                <>
                  <button
                    type='button'
                    disabled={isLoading}
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setHasSearched(false);
                      setIsModalOpen(false);
                    }}
                  >
                    <Icon
                      className='text-brand-gray-300 hover:text-brand-blue-700 cursor-pointer'
                      name='XClose'
                      size={28}
                    />
                  </button>
                  <div className='w-px h-5 bg-brand-gray-100 mx-1' />
                </>
              )}

              <button
                type='submit'
                disabled={isLoading}
                className='pl-1'
              >
                <Icon
                  className='text-brand-gray-300 hover:text-brand-blue-700 cursor-pointer'
                  name='Search'
                  size={32}
                />
              </button>
            </div>
          </form>
        </div>

        {/* 결과 리스트 */}
        <div className='mt-6 flex-1 overflow-y-auto space-y-2'>
          <div className='space-y-2'>
            <SearchInteraction
              isLoading={isLoading}
              hasSearched={hasSearched}
              query={query}
              results={results}
            />
            {results?.map((place: any) => (
              <SearchResultListItem
                key={place.id}
                place={place}
                onClick={handlePlaceClick}
              />
            ))}
          </div>
        </div>
        {isModalOpen && selectedPlace && (
          <GooglePlaceDetail
            place={selectedPlace}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPlace(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
