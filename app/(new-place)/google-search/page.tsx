'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import GoogleMapEmbed from '@/components/features/map/GoogleMapEmbed';
import NewPlaceFormContainer from '@/components/features/new-place/NewPlaceFormContainer';
import GooglePlaceDetail from '@/components/features/search/GooglePlaceDetail';
import SearchForm from '@/components/features/search/GoogleSearchForm';
import GoogleSearchResultListItem from '@/components/features/search/GoogleSearchResultItem';
import SearchInteraction from '@/components/features/search/SearchInteraction';
import { useGooglePlaceDetail } from '@/hooks/google-search/useGooglePlaceDetail';
import { useGoogleSearch } from '@/hooks/google-search/useGoogleSearch';
import { useModalStore } from '@/lib/store/modalStore';
import { COUNTRIES, type Country } from '@/lib/utils/countries';
import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';

export default function SearchGoogle() {
  const searchParams = useSearchParams();
  // 검색 결과 페이지에서 "신규 장소 등록" 버튼을 통해 넘어온 검색어를 입력창 초기값으로 채움
  // (자동으로 검색을 시작하지는 않음 — URL 직접 진입 시 의도치 않은 외부 API 호출을 막기 위함)
  const [query, setQuery] = useState(() => searchParams.get('query') ?? '');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedPlace, setSelectedPlace] = useState<SelectedGooglePlace | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewPlaceModalOpen, setIsNewPlaceModalOpen] = useState(false);

  const { open } = useModalStore();

  // 검색 mutation
  const { data: searchData, isFetching: isSearching } = useGoogleSearch({
    query: submittedQuery,
    languageCode: country.languageCode,
  });

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
  const handlePlaceClick = (place: SelectedGooglePlace) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  // selectedPlace에 additionalData 합치기
  const enrichedPlace = selectedPlace && additionalData ? { ...selectedPlace, additionalData } : null;

  return (
    <div className='relative overflow-hidden'>
      {/* 구글 embed 영역 */}
      <div className='absolute inset-0 pl-102'>
        <GoogleMapEmbed
          mode={selectedPlace ? 'place' : submittedQuery ? 'search' : 'view'}
          googlePlaceId={selectedPlace?.id}
          query={submittedQuery}
        />
      </div>

      <div className='relative h-screen bg-line-pattern bg-brand-blue-50 max-w-102 p-4 flex flex-col z-10'>
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
            {results?.map((place: SelectedGooglePlace) => (
              <GoogleSearchResultListItem
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
