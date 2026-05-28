'use client';

import FormTypeText from './form-inputs/FormTypeText';
import FormTypeSelect from './form-inputs/FormTypeSelect';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/types/CorePlace';
import type { NewPlaceFormState, Action } from '@/hooks/useNewPlaceForm';
import type { SelectedGooglePlace } from '@/types/googleSearchApiDetail';

interface Props {
  state: NewPlaceFormState;
  dispatch: React.Dispatch<Action>;
  place: SelectedGooglePlace;
}

export default function FormBasicGlobal({ state, dispatch, place }: Props) {
  return (
    <div className='mt-6 flex flex-col gap-4 mb-25 max-h-[44vh] overflow-auto'>
      <FormTypeText
        id='english_name'
        label='영문 이름'
        placeholder='예: Eiffel Tower'
        value={state.english_name}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'english_name', value })}
        required
      />

      <FormTypeText
        id='korean_name'
        label='한국어 이름'
        placeholder='예: 에펠탑'
        value={state.korean_name}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'korean_name', value })}
      />

      <FormTypeText
        id='original_name'
        label='현지어 이름'
        placeholder='예: Tour Eiffel'
        value={state.original_name}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'original_name', value })}
      />

      <FormTypeSelect
        id='category'
        label='카테고리'
        value={state.category}
        onChange={(value) => dispatch({ type: 'SET_CATEGORY', value: value as PlaceCategory })}
        options={PLACE_CATEGORIES}
        required
      />

      <FormTypeText
        id='address'
        label='주소'
        placeholder='주소 정보 없음'
        value={place.formattedAddress ?? ''}
        onChange={() => {}}
        readOnly
      />
    </div>
  );
}
