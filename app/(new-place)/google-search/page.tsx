'use client';

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
import SearchForm from '@/components/features/search/SearchForm';

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

  return (
    <div className='relative'>
      <Sidebar />
      <div className='relative h-screen bg-line-pattern bg-brand-blue-50 ml-[64px]  max-w-102 mx-auto p-4 flex flex-col'>
        {/* 검색 폼 */}
        <SearchForm
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          onClear={handleClearQuery}
          isSearching={isSearching}
          country={country}
          onCountryChange={setCountry}
        />

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
              open({
                type: 'cancelNewPlace',
                props: {
                  onCancel: () => setIsNewPlaceModalOpen(false),
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
