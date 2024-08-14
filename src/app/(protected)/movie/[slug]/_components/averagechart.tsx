"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartConfig = {
  above: {
    label: "Note positive",
    color: "hsl(var(--chart-5))",
  },
  below: {
    label: "Note négative",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type AverageChartProps = { vote_average: number; vote_count: number };

export function AverageChart({ vote_average, vote_count }: AverageChartProps) {
  const above = Math.round((vote_count * (1 - vote_average / 10)) / 2);
  const below = vote_count - above;
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full md:max-w-[250px]"
    >
      <RadialBarChart
        data={[{ above, below }]}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {vote_count.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Votants
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="above"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-desktop)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="below"
          fill="var(--color-mobile)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
