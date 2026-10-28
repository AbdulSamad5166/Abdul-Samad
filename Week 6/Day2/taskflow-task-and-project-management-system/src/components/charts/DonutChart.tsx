import React from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 180,
  strokeWidth = 24,
  centerLabel = 'Total',
  centerValue,
  className = '',
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedOffset = 0;
  const segments = data.map((item) => {
    const strokeDash = total > 0 ? (item.value / total) * circumference : 0;
    const strokeOffset = accumulatedOffset;
    accumulatedOffset += strokeDash;
    return {
      ...item,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <div className={`flex flex-col items-center sm:flex-row sm:items-center sm:justify-around gap-4 ${className}`}>
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
          role="img"
          aria-label="Donut chart showing priority distribution"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />

          {/* Data segments */}
          {total > 0 &&
            segments.map((seg, idx) => (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.strokeDash} ${circumference - seg.strokeDash}`}
                strokeDashoffset={-seg.strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            {centerValue !== undefined ? centerValue : total}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 min-w-[120px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
