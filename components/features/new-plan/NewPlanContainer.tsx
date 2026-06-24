'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/common/Icon';
import { createNewPlan } from '@/lib/actions/plan';
import { useCountries, useDestinations } from '@/hooks/useStaticData';
import PlanQuestion from './plan-question/PlanQuestion';
import DestinationAnswer from './plan-answer/DestinationAnswer';
import ScheduleAnswer from './plan-answer/ScheduleAnswer';
import PlanNameAnswer from './plan-answer/PlanNameAnswer';
import SkipButton from './plan-answer/SkipButton';
import FadeUp from '@/components/common/FadeUp';
import { useNewPlanForm } from '@/hooks/new-plan/useNewPlanForm';

type ScheduleMode = 'date' | 'undecided';
const { state, dispatch } = useNewPlanForm();

export default function NewPlanContainer() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState(''); // 'JPN:오사카' 형태
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [planName, setPlanName] = useState('');
  const [copied, setCopied] = useState(false);
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

  const nextStep = () => setStep((prev) => prev + 1);

  useEffect(() => {
    // 화면 진입하자마자 첫 답변창 노출
    setStep(1);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [step]);

  const submitPlan = async (title: string) => {
    if (state.planId || state.isPending) return;

    const [countryCode, city] = state.destination.split(':');
    dispatch({ type: 'SUBMIT_START' });

    const res = await createNewPlan({
      title: title || city || '제목 없음',
      destination: countryCode,
      departure_date: state.scheduleMode === 'date' ? state.startDate : null,
      arrival_date: state.scheduleMode === 'date' ? state.endDate : null,
      is_date_undecided: state.scheduleMode === 'undecided',
      total_days: state.scheduleMode === 'undecided' ? state.totalDays : null,
    });

    if (res.error) {
      dispatch({ type: 'SUBMIT_ERROR', error: res.error });
      return;
    }

    if (!res.data) return;

    dispatch({
      type: 'SUBMIT_SUCCESS',
      planId: res.data.planId,
      inviteToken: `${res.data.planId}/${res.data.token}`,
    });
  };

  const handleSubmit = () => submitPlan(planName);
  const handleSkip = () => submitPlan('');

  const handleCopy = async () => {
    if (!state.inviteToken) return;
    await navigator.clipboard.writeText(state.inviteToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!state.planId) return;
    router.push(`/plan/${state.planId}`);
  };
  console.log('Invite Token:', state.inviteToken);

  return (
    <div className='relative min-h-screen w-full bg-gradient-to-t from-[#fff1eb] to-[#ace0f9] flex justify-center py-10'>
      <div className='relative w-[560px] min-h-[700px] rounded-lg border border-white bg-gradient-to-b from-[rgba(249,250,251,0.8)] to-[rgba(237,240,243,0.8)] overflow-hidden'>
        {/* 헤더 */}
        <div className='absolute top-0 left-0 w-full h-[72px] bg-white rounded-t-lg z-10' />
        <div className='absolute top-[19px] left-[19px] flex items-center gap-4 z-10'>
          <button
            type='button'
            onClick={() => router.back()}
          >
            <Icon
              name='ArrowLeft'
              size={32}
              className='text-brand-gray-700'
            />
          </button>
          <p className='text-[20px] font-semibold text-brand-blue-800 tracking-[-0.6px]'>새로운 계획 생성하기</p>
        </div>

        {/* 채팅 영역 */}
        <div className='pt-[88px] pb-16 px-5 flex flex-col gap-6 overflow-y-auto h-full'>
          <FadeUp>
            {step >= 1 && <PlanQuestion>{`여행 계획을 시작해볼까요? \n여행하실 지역을 알려주세요.`}</PlanQuestion>}
          </FadeUp>

          {step >= 1 && (
            <FadeUp
              delay={0.4}
              className='self-end max-w-[286px] w-full'
            >
              <DestinationAnswer
                value={destination}
                onChange={setDestination}
                groups={groups}
                onOpenChange={setSelectOpen}
                onNext={nextStep}
              />
            </FadeUp>
          )}

          {step >= 2 && (
            <FadeUp>
              <PlanQuestion>{`언제 출발하실 예정인가요? \n여행 날짜를 선택해주세요.`}</PlanQuestion>
            </FadeUp>
          )}

          {step >= 2 && (
            <FadeUp
              delay={0.4}
              className='self-end max-w-[286px] w-full'
            >
              <ScheduleAnswer
                mode={scheduleMode}
                onModeChange={setScheduleMode}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                totalDays={totalDays}
                onTotalDaysChange={setTotalDays}
                onNext={nextStep}
              />
            </FadeUp>
          )}

          {step >= 3 && (
            <FadeUp>
              <PlanQuestion>{'딱 여행하기 좋은 시기네요.\n계획의 이름을 정해볼까요?'}</PlanQuestion>
            </FadeUp>
          )}

          {step >= 3 && (
            <FadeUp
              delay={0.4}
              className='self-end max-w-[286px] w-full flex flex-col gap-4'
            >
              <PlanNameAnswer
                value={planName}
                onChange={setPlanName}
                onNext={handleSubmit}
                isPending={state.isPending}
              />
              <SkipButton onClick={handleSkip} />
            </FadeUp>
          )}

          {state.submitError && step === 3 && (
            <PlanQuestion>
              <span className='text-red-400'>{state.submitError}</span>
            </PlanQuestion>
          )}

          {step >= 4 && (
            <>
              <FadeUp>
                <PlanQuestion>
                  <p>{'좋아요! \n 이 링크로 다른 사람을 초대할 수 있어요.'}</p>
                  <button
                    type='button'
                    onClick={handleCopy}
                    className='mt-2 flex items-center gap-2 bg-white rounded-lg px-3 py-2 max-w-[stretch] hover:bg-brand-gray-50 cursor-pointer'
                  >
                    <span className='flex-1 text-typo-sm text-brand-gray-700 truncate'>{state.inviteToken}</span>

                    <Icon
                      name={copied ? 'Check' : 'Copy'}
                      size={16}
                      className={`cursor-pointer hover:text-brand-gray-700 ${copied ? 'text-brand-blue-500' : 'text-brand-gray-400'}`}
                    />
                  </button>
                </PlanQuestion>
              </FadeUp>

              <FadeUp delay={0.4}>
                <PlanQuestion>
                  {'입력한 내용은 언제든 수정할 수 있어요.\n이제 구체적인 일정을 잡아볼까요?'}
                </PlanQuestion>
              </FadeUp>

              <FadeUp delay={0.2}>
                <SkipButton
                  label='좋아요!'
                  onClick={handleConfirm}
                />
              </FadeUp>
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
