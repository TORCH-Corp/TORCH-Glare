'use client'
import { Bar, BarChart, LabelList, XAxis } from 'recharts';
import { ChartConfig, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/Charts';
import { ChartTooltipContent } from '@/components/Charts';
import { ChartContainer } from '@/components/Charts';

export default function page() {

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <div className='w-full h-full'>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <LabelList className="fill-[--color-desktop]" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

