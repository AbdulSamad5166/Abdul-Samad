import React from 'react';

export interface BarChartData {
  label: string;
  value: number;
  colorClass: string;
}

interface BarChartProps {
  data: BarChartData[];
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="flex items-end justify-around gap-4 pt-4 pb-1"
        role="img"
        aria-label="Bar chart showing task distribution by status"
      >
        {data.map((item, index) => {
          const percentage = Math.round((item.value / maxValue) * 100);
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {item.value}
              </span>
              <div className="w-full max-w-[42px] h-28 bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ease-out ${item.colorClass}`}
                  style={{ height: `${Math.max(percentage, 10)}%` }}
                />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
