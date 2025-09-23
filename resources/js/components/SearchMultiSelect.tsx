import React, { useMemo, useState } from 'react';

interface Option { id: number | string; name: string }

export default function SearchMultiSelect({ options = [], value = [], onChange, placeholder = '' }: {
    options: Option[];
    value: (number | string)[];
    onChange: (vals: number[]) => void;
    placeholder?: string;
}) {
    const [q, setQ] = useState('');

    // normalize options and value to numbers for stable comparisons
    const normalizedOptions = useMemo(() => options.map(o => ({ id: Number(o.id), name: o.name })), [options]);
    const valueNums = useMemo(() => (value || []).map(v => Number(v)), [value]);

    const filtered = useMemo(() => {
        if (!q) return normalizedOptions;
        return normalizedOptions.filter(o => o.name.toLowerCase().includes(q.toLowerCase()));
    }, [normalizedOptions, q]);

    const toggle = (id: number) => {
        if (valueNums.includes(id)) onChange(valueNums.filter(v => v !== id));
        else onChange([...valueNums, id]);
    }

    return (
        <div className="border rounded p-2">
            <input
                className="w-full mb-2 p-1"
                placeholder={placeholder}
                value={q}
                onChange={e => setQ(e.target.value)}
            />

            {/* selected chips */}
            <div className="flex flex-wrap gap-1 mb-2">
                {valueNums.map(v => {
                    const opt = normalizedOptions.find(o => o.id === v);
                    if (!opt) return null;
                    return (
                        <div key={v} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                            <span>{opt.name}</span>
                            <button type="button" onClick={() => toggle(v)} className="ml-1 text-blue-600">×</button>
                        </div>
                    );
                })}
            </div>

            <div className="max-h-44 overflow-auto">
                {filtered.map(o => (
                    <div key={o.id} className="flex items-center gap-2 py-1">
                        <input type="checkbox" checked={valueNums.includes(o.id)} onChange={() => toggle(o.id)} />
                        <div className="text-sm">{o.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
