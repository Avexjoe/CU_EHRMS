import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VISITS } from '@/data/mockData';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface UserAnalyticsProps {
  roleField: 'nurseId' | 'doctorId' | 'all';
  userId?: string;
  title?: string;
}

const getDateRange = (period: string) => {
  const now = new Date('2026-03-27');
  const start = new Date(now);
  switch (period) {
    case 'Today':
      break;
    case 'This Week':
      start.setDate(now.getDate() - 7);
      break;
    case 'This Month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'This Year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
};

const UserAnalytics: React.FC<UserAnalyticsProps> = ({ roleField, userId, title = 'My Activity' }) => {
  const periods = ['Today', 'This Week', 'This Month', 'This Year'];

  const data = periods.map(period => {
    const { start, end } = getDateRange(period);
    const filtered = VISITS.filter(v => {
      const inRange = v.date >= start && v.date <= end;
      if (roleField === 'all') return inRange;
      return inRange && v[roleField] === userId;
    });
    return {
      period,
      Total: filtered.length,
      Completed: filtered.filter(v => v.status === 'completed').length,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
            />
            <Bar dataKey="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
