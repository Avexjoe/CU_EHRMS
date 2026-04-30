import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVisits } from '@/hooks/useVisits';

interface UserAnalyticsProps {
  roleField?: string;
  userId?: string;
  title?: string;
}

const UserAnalytics: React.FC<UserAnalyticsProps> = ({ title = 'Patient Activity' }) => {
  const { visits } = useVisits();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const yearAgo = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];

  const data = [
    { period: 'Today', Total: visits.filter(v => v.date === today).length, Completed: visits.filter(v => v.date === today && v.status === 'completed').length },
    { period: 'This Week', Total: visits.filter(v => v.date >= weekAgo).length, Completed: visits.filter(v => v.date >= weekAgo && v.status === 'completed').length },
    { period: 'This Month', Total: visits.filter(v => v.date >= monthAgo).length, Completed: visits.filter(v => v.date >= monthAgo && v.status === 'completed').length },
    { period: 'This Year', Total: visits.filter(v => v.date >= yearAgo).length, Completed: visits.filter(v => v.date >= yearAgo && v.status === 'completed').length },
  ];

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
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px', color: 'hsl(var(--foreground))' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }} />
            <Bar dataKey="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
