'use client';

import { Icon } from '@/components/common/Icon';
import CountrySelect from '@/components/features/CountrySelect';
import { type Country } from '@/lib/utils/countries';

interface SearchFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onClear: () => void;
  isSearching: boolean;
  country: Country;
  onCountryChange: (country: Country) => void;
}

export default function SearchForm({
  query,
  onQueryChange,
  onSubmit,
  onClear,
  isSearching,
  country,
  onCountryChange,
}: SearchFormProps) {
  return (
    <>
      <div className='relative flex-shrink-0 flex flex-row items-center gap-4'>
        <Icon
          className='shrink-0'
          name='ArrowLeft'
          size={32}
        />
        <form
          onSubmit={onSubmit}
          className='flex gap-2 rounded-full w-full'
        >
          <input
            type='text'
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder='구글 장소 검색'
            className=' flex-1 px-4 py-2 border-2 border-brand-blue-700 rounded-full outline-none focus:border-blue-500 bg-brand-gray-0 text-typo-base'
          />
          <div className='absolute top-[5px] right-3 rounded-lg flex items-center'>
            {query !== '' && (
              <>
                <button
                  type='button'
                  disabled={isSearching}
                  onClick={onClear}
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
          onChange={onCountryChange}
        />
      </div>
    </>
  );
}
