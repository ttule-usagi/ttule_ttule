'use client';

import { createNewPlan } from '@/lib/actions/plan';
import { useState } from 'react';

export default function PlanCreate() {
  const [result, setResult] = useState<string>('');

  const handleTest = async () => {
    const res = await createNewPlan({
      title: '테스트 계획',
      destination: 'JPN',
      departure_date: '2025-08-01',
      arrival_date: '2025-08-05',
      is_date_undecided: false,
      total_days: null,
    });

    setResult(JSON.stringify(res, null, 2));
  };

  const handleTestUndecided = async () => {
    const res = await createNewPlan({
      title: '날짜 미정 테스트',
      destination: 'USA',
      departure_date: null,
      arrival_date: null,
      is_date_undecided: true,
      total_days: 3,
    });

    setResult(JSON.stringify(res, null, 2));
  };

  return (
    <div className='p-10 flex flex-col gap-4'>
      <h1 className='text-xl font-bold'>Plan 생성 테스트</h1>
      <div className='flex gap-4'>
        <button
          onClick={handleTest}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          날짜 확정 플랜 생성
        </button>
        <button
          onClick={handleTestUndecided}
          className='px-4 py-2 bg-green-500 text-white rounded'
        >
          날짜 미정 플랜 생성
        </button>
      </div>
      {result && <pre className='p-4 bg-gray-100 rounded text-sm'>{result}</pre>}
    </div>
  );
}
