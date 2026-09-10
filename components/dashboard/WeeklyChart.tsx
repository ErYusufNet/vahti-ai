"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { overview } from "@/lib/mock/data";

/** Görev 3: viikon keskustelut kanavittain (recharts). */
export function WeeklyChart() {
  const t = useTranslations("Overview");

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={overview.viikko} barGap={2} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ea" vertical={false} />
          <XAxis dataKey="paiva" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} />
          <Tooltip
            contentStyle={{
              border: "1px solid #e2e6ea",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="whatsapp" name={t("channelWhatsapp")} fill="#3aa0d1" radius={[3, 3, 0, 0]} />
          <Bar dataKey="puhelu" name={t("channelVoice")} fill="#7cc4e0" radius={[3, 3, 0, 0]} />
          <Bar dataKey="chat" name={t("channelChat")} fill="#b9dfef" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
