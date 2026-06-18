'use client';

import FormTypeText from './form-inputs/FormTypeText';
import FormTypeSelect from './form-inputs/FormTypeSelect';
import type { NewPlaceFormState, Action } from '@/hooks/useNewPlaceForm';
import type { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import { PLACE_CATEGORIES, PlaceCategory } from '@/types/CorePlace';

interface Props {
  state: NewPlaceFormState;
  dispatch: React.Dispatch<Action>;
  place: SelectedGooglePlace;
}

export default function FormBasicKorean({ state, dispatch, place }: Props) {
  return (
    <div className='mt-6 flex flex-col gap-6  overflow-auto flex-1 overflow-y-auto'>
      <FormTypeSelect
        id='category'
        label='카테고리'
        value={state.category}
        onChange={(value) => dispatch({ type: 'SET_CATEGORY', value: value as PlaceCategory })}
        options={PLACE_CATEGORIES}
        required
      />
      <FormTypeText
        id='korean_name'
        label='한국어 이름'
        placeholder='한국어 이름을 입력해주세요'
        value={state.korean_name}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'korean_name', value })}
        required
      />

      <FormTypeText
        id='english_name'
        label='영문 이름'
        placeholder='영문 이름을 입력해주세요'
        value={state.english_name}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'english_name', value })}
      />

      <FormTypeText
        id='address'
        label='주소'
        value={place.formattedAddress ?? ''}
        onChange={() => {}}
        readOnly
      />
    </div>
  );
}
