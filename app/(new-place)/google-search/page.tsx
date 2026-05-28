'use client';

import { Icon } from '@/components/common/Icon';
import CountrySelect from '@/components/features/CountrySelect';
import NewPlaceFormContainer from '@/components/features/new-place/NewPlaceFormContainer';
import GooglePlaceDetail from '@/components/features/search/GooglePlaceDetail';
import SearchInteraction from '@/components/features/search/SearchInteraction';
import SearchResultListItem from '@/components/features/search/SearchResultItem';
import Sidebar from '@/components/layouts/Sidebar';
import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import React, { useState } from 'react';
import { useGoogleSearch } from '@/hooks/google-search/useGoogleSearch';
import { useGooglePlaceDetail } from '@/hooks/google-search/useGooglePlaceDetail';
import { COUNTRIES, type Country } from '@/lib/utils/countries';
import { useModalStore } from '@/lib/store/modalStore';

export default function SearchGoogle() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedPlace, setSelectedPlace] = useState<SelectedGooglePlace | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewPlaceModalOpen, setIsNewPlaceModalOpen] = useState(false);

  const { open } = useModalStore();

  // 검색 mutation
  const {
    data: searchData,
    isFetching: isSearching,
    isSuccess: hasSearched,
    status,
    fetchStatus,
  } = useGoogleSearch({ query: submittedQuery, languageCode: country.languageCode });

  const results = searchData?.places ?? [];

  // 상세 조회 query
  const { data: additionalData } = useGooglePlaceDetail(selectedPlace?.id ?? null);

  // 검색 핸들러 - input값을 submittedQuery로 옮길때 검색됨
  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
  };

  // 입력 지우기
  const handleClearQuery = () => {
    setQuery('');
    setSubmittedQuery(''); // mutation 결과도 초기화
    setIsDetailModalOpen(false);
    setSelectedPlace(null);
  };

  // 장소 클릭
  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  // selectedPlace에 additionalData 합치기
  const enrichedPlace = selectedPlace && additionalData ? { ...selectedPlace, additionalData } : null;

  console.log('country: ', country);

  return (
    <div className='relative'>
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
                    disabled={isSearching}
                    onClick={() => {
                      handleClearQuery();
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
                disabled={isSearching}
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
        <div className='flex flex-row mt-3 items-center gap-2'>
          <span className='text-typo-description font-semibold text-brand-gray-600 shrink-0'>검색 국가</span>
          <CountrySelect
            value={country}
            onChange={setCountry}
          />
        </div>

        {/* 결과 리스트 */}
        <div className='mt-4 flex-1 overflow-y-auto space-y-2 '>
          <div className='space-y-2'>
            <SearchInteraction
              isLoading={isSearching}
              submittedQuery={submittedQuery}
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
        {isDetailModalOpen && enrichedPlace && (
          <GooglePlaceDetail
            place={enrichedPlace}
            addNewPlace={() => {
              setIsNewPlaceModalOpen(true);
            }}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedPlace(null);
            }}
          />
        )}
        {isNewPlaceModalOpen && enrichedPlace && (
          <NewPlaceFormContainer
            place={enrichedPlace}
            onClose={() => {
              setIsNewPlaceModalOpen(false);
            }}
            onCancelClose={() => {
              open('cancelNewPlace', {
                onCancel: () => setIsNewPlaceModalOpen(false),
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
