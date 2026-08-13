import { useMemo, useState } from 'react';

import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { useUpdatePlanInfoForm } from '@/hooks/plan/useUpdatePlanInfoForm';
import { useCountries, useDestinations } from '@/hooks/useStaticData';
import { DESTINATIONS } from '@/lib/utils/destinations';

import FormTypeText from '../../new-place/form-inputs/FormTypeText';

import FormTypeSelectDeparture from './FormTypeSelectDeparture';
import PlanDateContent from './PlanDateContent';

interface Props {
  id: string;
  onClose: () => void;
}

export default function PlanInfoContent({ id, onClose }: Props) {
  const { data } = useGetPlanDetail(id);
  const [selectOpen, setSelectOpen] = useState(false);

  const matchedDestination = DESTINATIONS.find((d) => d.city === data.plan.destination);
  const destinationValue = matchedDestination ? `${matchedDestination.countryCode}:${matchedDestination.city}` : '';

  const { state, dispatch, handleSubmit, isPending, error } = useUpdatePlanInfoForm(id, {
    planName: data.plan.title,
    destination: destinationValue,
    scheduleMode: data.plan.isDateUndecided ? 'undecided' : 'date',
    startDate: data.plan.departureDate ?? '',
    endDate: data.plan.arrivalDate ?? '',
    totalDays: data.plan.totalDays,
  });

  const { data: countries } = useCountries(selectOpen || !!state.destination);
  const { data: destinations } = useDestinations(selectOpen || !!state.destination);

  const groups = useMemo(() => {
    if (!countries || !destinations) return [];
    const countryMap = new Map<string, string>(countries.map((c) => [c.countryCode, c.label]));
    const grouped = new Map<string, { groupLabel: string; options: { label: string; value: string }[] }>();
    for (const dest of destinations) {
      const countryLabel = countryMap.get(dest.countryCode) ?? dest.countryCode;
      if (!grouped.has(dest.countryCode)) {
        grouped.set(dest.countryCode, { groupLabel: countryLabel, options: [] });
      }
      grouped.get(dest.countryCode)!.options.push({
        label: dest.city,
        value: `${dest.countryCode}:${dest.city}`,
      });
    }
    return Array.from(grouped.values());
  }, [countries, destinations]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {' '}
      <form
        id='UpdatePlanInfoForm'
        onSubmit={(e) => e.preventDefault()}
      >
        <FormTypeText
          id='plan_name'
          label='계획 이름'
          placeholder='계획 이름을 입력해주세요'
          value={state.planName}
          onChange={(value) => dispatch({ type: 'SET_PLAN_NAME', value })}
        />
        <FormTypeSelectDeparture
          id='destination'
          placeholder='여행할 지역을 검색해주세요'
          value={state.destination}
          onChange={(value) => dispatch({ type: 'SET_DESTINATION', value })}
          groups={groups}
          onOpenChange={setSelectOpen}
        />
        <PlanDateContent
          mode={state.scheduleMode}
          onModeChange={(value) => dispatch({ type: 'SET_SCHEDULE_MODE', value })}
          startDate={state.startDate}
          endDate={state.endDate}
          onStartDateChange={(value) => dispatch({ type: 'SET_START_DATE', value })}
          onEndDateChange={(value) => dispatch({ type: 'SET_END_DATE', value })}
          totalDays={state.totalDays}
          onTotalDaysChange={(value) => dispatch({ type: 'SET_TOTAL_DAYS', value })}
        />{' '}
      </form>
      <div className='absolute left-0 bottom-0 w-full px-6 py-5 bg-brand-gray-200 rounded-b-lg'>
        {error && (
          <p
            role='alert'
            className='text-red-500 text-typo-description'
          >
            {error}
          </p>
        )}
        <button
          className='float-right py-3 px-9 typo-text-base-bold text-white bg-brand-blue-700 rounded-sm hover:bg-brand-blue-800 cursor-pointer'
          form='UpdatePlanInfoForm'
          type='button'
          onClick={handleSubmit}
        >
          {isPending ? '저장 중...' : '저장하기'}
        </button>
        <button
          className=' float-right py-3 px-11 mr-4 text-typo-base-bold text-brand-gray-500 rounded-sm cursor-pointer hover:bg-gray-300'
          type='button'
          onClick={handleClose}
        >
          취소
        </button>
      </div>
    </>
  );
}
