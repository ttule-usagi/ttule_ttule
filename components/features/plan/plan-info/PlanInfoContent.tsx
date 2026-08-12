import { useMemo, useState } from 'react';

import { useGetPlanDetail } from '@/hooks/plan/useGetPlanDetail';
import { useUpdatePlanInfoForm } from '@/hooks/plan/useUpdatePlanInfoForm';
import { useCountries, useDestinations } from '@/hooks/useStaticData';

import FormTypeText from '../../new-place/form-inputs/FormTypeText';

import FormTypeSelectDeparture from './FormTypeSelectDeparture';
import PlanDateContent from './PlanDateContent';

interface Props {
  id: string;
}

export default function PlanInfoContent({ id }: Props) {
  const { data } = useGetPlanDetail(id);

  const { state, dispatch } = useUpdatePlanInfoForm({
    planName: data.plan.title,
    destination: data.plan.destination,
    scheduleMode: data.plan.isDateUndecided ? 'undecided' : 'date',
    startDate: data.plan.departureDate ?? '',
    endDate: data.plan.arrivalDate ?? '',
    totalDays: data.plan.totalDays,
  });
  const [selectOpen, setSelectOpen] = useState(false);

  const { data: countries } = useCountries(selectOpen);
  const { data: destinations } = useDestinations(selectOpen);

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

  return (
    <>
      <FormTypeText
        id='plan_name'
        label='계획 이름'
        placeholder='계획 이름을 입력해주세요'
        value={state.planName}
        onChange={(value) => dispatch({ type: 'SET_PLAN_NAME', value })}
        required
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
      />
    </>
  );
}
