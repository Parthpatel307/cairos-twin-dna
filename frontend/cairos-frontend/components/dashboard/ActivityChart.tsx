"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { time: "10:00", actions: 18 },
  { time: "11:00", actions: 31 },
  { time: "12:00", actions: 27 },
  { time: "13:00", actions: 48 },
  { time: "14:00", actions: 44 },
  { time: "15:00", actions: 61 },
  { time: "16:00", actions: 54 },
  { time: "17:00", actions: 79 },
];

export default function ActivityChart() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d100d] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Agent Activity
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Live execution volume
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white/35">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,.8)]" />
          LIVE
        </div>
      </div>

      <div className="mt-8 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="activityFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#bef264"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#bef264"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,.05)"
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,.25)",
                fontSize: 10,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,.25)",
                fontSize: 10,
              }}
            />

            <Tooltip
              contentStyle={{
                background: "#090c09",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "12px",
              }}
              labelStyle={{
                color: "rgba(255,255,255,.5)",
              }}
            />

            <Area
              type="monotone"
              dataKey="actions"
              stroke="#bef264"
              strokeWidth={2}
              fill="url(#activityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}