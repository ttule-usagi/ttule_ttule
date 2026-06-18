'use client';

import { Icon } from '@/components/common/Icon';
import { useDebounce } from '@/hooks/useDebounce';
import { useAutoCompleteSearch } from '@/hooks/place-search/useAutoCompleteSearch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AutoComplete, { type AutoCompleteItem } from './AutoComplete';

const SEARCH_RESULT_PATH = '/places/search';

export default function DBSearchInput() {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 자동완성 api, 검색 결과 api 필요
  // 엔터키 누르기 전, 자동완성 항목 클릭 전까지는 자동완성 항목 노출
  // 엔터키 누른 후에는 결과 리스트
  const [value, setValue] = useState('');
  const [isAutoCompleteOpen, setIsAutoCompleteOpen] = useState(false);
  const debounced = useDebounce(value, 500);
  const isSearchResultPage = path === SEARCH_RESULT_PATH;

  // 검색 결과 페이지에 URL로 직접 진입(또는 새로고침)했을 때 query 파라미터로 입력값을 채우고,
  // 검색 결과 페이지를 벗어나면 입력값을 리셋
  useEffect(() => {
    if (isSearchResultPage) {
      setValue(searchParams.get('query') ?? '');
      return;
    }

    setValue('');
  }, [isSearchResultPage, searchParams]);

  const { data } = useAutoCompleteSearch(debounced);
  const autoCompleteItems: AutoCompleteItem[] = data?.items ?? [];

  // 자동완성 결과가 도착하면 노출 여부를 결정
  // (검색 결과 페이지에서는 자동완성을 띄우지 않고, 그 외에는 검색어/결과 유무로 판단)
  useEffect(() => {
    if (isSearchResultPage || debounced.trim() === '' || autoCompleteItems.length === 0) {
      setIsAutoCompleteOpen(false);
      return;
    }

    setIsAutoCompleteOpen(true);
  }, [isSearchResultPage, debounced, autoCompleteItems]);

  const handleSubmit = () => {
    if (value.trim() === '') return;
    setIsAutoCompleteOpen(false);
    router.push(`/places/search?query=${encodeURIComponent(value)}`);
  };

  // 검색 결과 api 호출하는 검색 결과 페이지로 이동
  const handleSubmitValue = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  // 한글 등 조합 중인 입력에서 엔터를 누르면 isComposing이 true이므로 무시
  // (조합 완료 후 발생하는 별도의 키 입력과 중복 제출되는 것을 방지)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (e.nativeEvent.isComposing) return;

    // 자동완성이 열려 있는 동안의 엔터는 AutoComplete 내부 키보드 핸들러가 항목 선택을 처리하므로
    // 여기서는 자동완성이 닫혀 있을 때만 폼 제출로 처리
    if (isAutoCompleteOpen) return;

    e.preventDefault();
    handleSubmit();
  };

  const handleSelectItem = (item: AutoCompleteItem) => {
    setValue(item.name);
    setIsAutoCompleteOpen(false);
    router.push(`/places/detail/${item.id}`);
  };

  const handleCloseAutoComplete = () => {
    setIsAutoCompleteOpen(false);
  };

  const handleClearQuery = () => {
    setValue('');
    setIsAutoCompleteOpen(false);
  };

  return (
    <div className='relative flex gap-4 items-center mb-8'>
      {path !== '/places' && (
        <Icon
          name='ArrowLeft'
          size={32}
          className='text-brand-blue-700 cursor-pointer'
          onClick={() => router.back()}
        />
      )}
      <form
        className='w-full flex text-typo-base border-brand-blue-700 pl-6 pr-4 py-1.25 bg-brand-gray-0 rounded-[30px] border-2 items-center flex-1 gap-2'
        onSubmit={handleSubmitValue}
      >
        <input
          placeholder='장소 검색'
          className='text-brand-gray-600 w-full outline-none'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <div className='flex items-center'>
          {value !== '' && (
            <>
              <button
                type='button'
                onClick={handleClearQuery}
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
            className='text-brand-blue-700 cursor-pointer'
          >
            <Icon
              name='Search'
              size={32}
            />
          </button>
        </div>
      </form>
      {isAutoCompleteOpen && (
        <AutoComplete
          items={autoCompleteItems}
          onSelect={handleSelectItem}
          onClose={handleCloseAutoComplete}
        />
      )}
    </div>
  );
}
