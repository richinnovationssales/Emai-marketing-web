'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  fetchContacts,
  searchContacts,
  deleteContact,
  selectContacts,
  selectContactLoading,
  selectIsSearching,
  selectNextCursor,
  selectSearchQuery,
} from '@/store/slices/contact.slice';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContactsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const contacts    = useSelector(selectContacts);
  const isLoading   = useSelector(selectContactLoading);
  const isSearching = useSelector(selectIsSearching);
  const nextCursor  = useSelector(selectNextCursor);
  const searchQuery = useSelector(selectSearchQuery); // read from Redux so it survives re-renders

  const [inputValue, setInputValue] = useState(searchQuery);
  const fetchedRef  = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Initial fetch — only runs once
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(fetchContacts({ limit: 20 }));
  }, [dispatch]);

  // Debounced search — fires 400ms after user stops typing
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const q = value.trim();
        if (q.length === 0) {
          // Cleared → go back to normal browse
          dispatch(fetchContacts({ limit: 20 }));
        } else if (q.length >= 2) {
          dispatch(searchContacts({ q, limit: 20 }));
        }
        // 1 char → do nothing, wait for more input
      }, 400);
    },
    [dispatch]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleClear = () => {
    setInputValue('');
    dispatch(fetchContacts({ limit: 20 }));
  };

  // Load More — search-aware
  const handleLoadMore = () => {
    if (!nextCursor) return;
    const q = inputValue.trim();
    if (q.length >= 2) {
      dispatch(searchContacts({ q, cursor: nextCursor, limit: 20 }));
    } else {
      dispatch(fetchContacts({ cursor: nextCursor, limit: 20 }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await dispatch(deleteContact(id)).unwrap();
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  const busy = isLoading || isSearching;
  const isActiveSearch = inputValue.trim().length >= 2;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage your subscriber list and audience.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/client/contacts/import">
            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          </Link>
          <Link href="/client/contacts/create">
            <Button><Plus className="mr-2 h-4 w-4" /> New Contact</Button>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search by email or field..."
          className="pl-9 pr-9"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* No-results hint when searching */}
      {isActiveSearch && !busy && contacts.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No contacts found for &quot;{inputValue.trim()}&quot;.
        </p>
      )}

      {/* Full-page loader — only on initial load or fresh search with empty list */}
      {busy && contacts.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ContactsTable data={contacts} onDelete={handleDelete} />

          {/* Inline spinner for load-more fetches */}
          {busy && contacts.length > 0 && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {nextCursor && !busy && (
            <div className="flex justify-center pt-4">
              <Button variant="ghost" onClick={handleLoadMore}>Load More</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 'use client';

// import { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '@/store';
// import { fetchContacts, selectContacts, selectContactLoading, selectNextCursor, deleteContact } from '@/store/slices/contact.slice';
// import { ContactsTable } from '@/components/contacts/ContactsTable';
// import { Button } from '@/components/ui/button';
// import { Plus, Upload, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from 'sonner';

// export default function ContactsPage() {
//     const dispatch = useDispatch<AppDispatch>();
//     const contacts = useSelector(selectContacts);
//     const isLoading = useSelector(selectContactLoading);
//     const nextCursor = useSelector(selectNextCursor);
//     const fetchedRef = useRef(false);

//     useEffect(() => {
//         if (fetchedRef.current) return;
//         fetchedRef.current = true;
//         dispatch(fetchContacts({ limit: 20 }));
//     }, [dispatch]);

//     const handleDelete = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this contact?')) return;
//         try {
//             await dispatch(deleteContact(id)).unwrap();
//             toast.success('Contact deleted');
//         } catch (error) {
//             toast.error('Failed to delete contact');
//         }
//     };

//     return (
//         <div className="space-y-6 max-w-[1600px] mx-auto py-6 px-4">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                    <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
//                    <p className="text-muted-foreground">Manage your subscriber list and audience.</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                      <Link href="/client/contacts/import">
//                         <Button variant="outline">
//                             <Upload className="mr-2 h-4 w-4" /> Import
//                         </Button>
//                     </Link>
//                     <Link href="/client/contacts/create">
//                         <Button>
//                             <Plus className="mr-2 h-4 w-4" /> New Contact
//                         </Button>
//                     </Link>
//                 </div>
//             </div>

//             {isLoading && contacts.length === 0 ? (
//                 <div className="flex justify-center py-12">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//             ) : (
//                 <ContactsTable data={contacts} onDelete={handleDelete} />
//             )}
            
//             {/* Simple Load More impl */}
//             {nextCursor && !isLoading && (
//                  <div className="flex justify-center pt-4">
//                     <Button variant="ghost" onClick={() => dispatch(fetchContacts({ cursor: nextCursor, limit: 20 }))}>
//                         Load More
//                     </Button>
//                  </div>
//             )}
//         </div>
//     );
// }
