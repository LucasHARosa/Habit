import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';


import dayjs from 'dayjs';
import { HabitList } from './HabitList';

interface HabitDayProps {
  date: Date
  defaultCompleted?: number
  amount?: number
}

// interface HabitDayProps {
//   completed: number
// }

export function HabitDay({ defaultCompleted =0, amount=0 , date}: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted)
  //math.round arredonda o valor
  const completedPercentual = amount > 0 ? Math.round((completed / amount) * 100) : 0
  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = dayjs(date).format('dddd')

  function handleCompletedChaged(completed: number) {
    setCompleted(completed)
  }
    return (
      <Popover.Root>
        <Popover.Trigger
          className={clsx("w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:right-2 focus:ring-violet-700 focus:ring-offset-2  focus:ring-offset-background", {
            'bg-zinc-900 border-zinc-800': completedPercentual === 0,
            'bg-violet-900 border-violet-500': completedPercentual > 0 && completedPercentual < 20,
            'bg-violet-800 border-violet-500': completedPercentual >= 20 && completedPercentual < 40,
            'bg-violet-700 border-violet-500': completedPercentual >= 40 && completedPercentual < 60,
            'bg-violet-600 border-violet-500': completedPercentual >= 60 && completedPercentual < 80,
            'bg-violet-500 border-violet-400': completedPercentual >= 80,
          })}
        />

        <Popover.Portal>
          <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
            <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
            <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

            <ProgressBar progress={completedPercentual} />
            <HabitList date={date} onCompletedChanged={handleCompletedChaged} />

            <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }