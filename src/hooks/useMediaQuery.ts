import { useState, useEffect } from 'react';
export function useMediaQuery(query: string) { const [matches, setMatches] = useState(false); return matches; }
