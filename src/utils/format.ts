export const fmt = (v: any) => typeof v === 'boolean' ? (v ? 'Yes' : 'No') : Array.isArray(v) ? v.length + ' linked' : String(v)
