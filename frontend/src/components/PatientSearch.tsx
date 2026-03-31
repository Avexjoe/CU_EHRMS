import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { PATIENTS, Patient } from '@/data/mockData';

interface PatientSearchProps {
  onSelect: (patient: Patient) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = query.length > 0
    ? PATIENTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search patient by name or ID..."
        className="pl-10"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          {filtered.map(p => (
            <button
              key={p.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
              onClick={() => { onSelect(p); setQuery(p.name); setOpen(false); }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{p.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">ID: {p.id} · {p.age}y · {p.gender}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
