'use client';

import FormTypeText from './form-inputs/FormTypeText';
import ImageUpload from './form-inputs/ImageUpload';
import type { NewPlaceFormState, Action } from '@/hooks/useNewPlaceForm';

interface Props {
  state: NewPlaceFormState;
  dispatch: React.Dispatch<Action>;
}

export default function FormDetail({ state, dispatch }: Props) {
  return (
    <div className='mt-6 flex flex-col gap-6'>
      <FormTypeText
        id='website_uri'
        label='웹사이트'
        type='url'
        placeholder='https://example.com'
        value={state.website_uri}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'website_uri', value })}
      />

      <FormTypeText
        id='phone_number'
        label='전화번호'
        type='tel'
        placeholder='전화번호를 입력해주세요'
        value={state.phone_number}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'phone_number', value })}
      />

      <ImageUpload
        url={state.imageUrl}
        onChange={(url) => dispatch({ type: 'SET_IMAGES', url })}
      />
    </div>
  );
}
