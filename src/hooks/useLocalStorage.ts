import { useState, useEffect } from 'react';
export function useLocalStorage<T>(key: string, initialValue: T) { const [value, setValue] = useState<T>(initialValue); return [value, setValue] as const; }
