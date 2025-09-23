import React, { useMemo, useState } from 'react';

interface Option { id: number; name: string }

export default function SearchMultiSelect({ options = [], value = [], onChange, placeholder = '' }: {
    options: Option[];
    value: number[];
    onChange: (vals: number[]) => void;
    placeholder?: string;
}) {
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        if (!q) return options;
        return options.filter(o => o.name.toLowerCase().includes(q.toLowerCase()));
    }, [options, q]);

    const toggle = (id: number) => {
        if (value.includes(id)) onChange(value.filter(v => v !== id));
        else onChange([...value, id]);
    }

    return (
        <div className="rounded-lg border bg-white/60 p-2 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-2">
                {value.length === 0 && (
                    <div className="text-xs text-gray-400 italic px-2">{placeholder}</div>
                )}
                {options.filter(o => value.includes(o.id)).map(o => (
                    <div key={o.id} className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
                        <span>{o.name}</span>
                        <button onClick={() => toggle(o.id)} className="text-emerald-600 hover:text-emerald-800 ml-1">×</button>
                    </div>
                ))}
            </div>

            <input
                aria-label="search"
                className="w-full mb-2 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder={value.length === 0 ? placeholder : 'Search to add...'}
                value={q}
                onChange={e => setQ(e.target.value)}
            />

            <div className="max-h-44 overflow-auto">
                {filtered.map(o => (
                    <div key={o.id} className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50 rounded cursor-pointer" onClick={() => toggle(o.id)}>
                        <input type="checkbox" checked={value.includes(o.id)} readOnly className="w-4 h-4" />
                        <div className="text-sm text-gray-700">{o.name}</div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-xs text-gray-400 p-2">No matches</div>
                )}
            </div>
        </div>
    )
}
