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

  const normalizedQuery = query.toLowerCase().trim();

  const filtered = normalizedQuery.length > 0
    ? PATIENTS.filter(p =>
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.id.toLowerCase().includes(normalizedQuery) ||
        p.firstName.toLowerCase().includes(normalizedQuery) ||
        p.lastName.toLowerCase().includes(normalizedQuery) ||
        p.phone?.toLowerCase().includes(normalizedQuery) ||
        p.nationalId?.toLowerCase().includes(normalizedQuery) ||
        p.nhisCard?.toLowerCase().includes(normalizedQuery) ||
        p.studentId?.toLowerCase().includes(normalizedQuery) ||
        p.bloodType?.toLowerCase().includes(normalizedQuery) ||
        p.department?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name, ID, phone, NHIS, department..."
        className="pl-10"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-72 overflow-y-auto">
          {filtered.map(p => (
            <button
              key={p.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
              onClick={() => { onSelect(p); setQuery(p.name); setOpen(false); }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{p.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  ID: {p.id} · {p.age}y · {p.gender}
                  {p.department ? ` · ${p.department}` : ''}
                  {p.nhisCard ? ` · NHIS: ${p.nhisCard}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && normalizedQuery.length > 0 && filtered.length === 0 && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-4 text-center text-sm text-muted-foreground">
          No patients found for "{query}"
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
