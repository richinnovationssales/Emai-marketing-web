// /**
//  * QUICK REFERENCE: Preventing Hydration Mismatches
//  * 
//  * This file provides quick copy-paste examples for common scenarios.
//  */

// // ============================================
// // 1. DATE FORMATTING (Most Common)
// // ============================================

// // ❌ OLD WAY (causes hydration errors)
// import { format } from 'date-fns';
// // { format(new Date(user.createdAt), 'MMM d, yyyy') }

// // ✅ NEW WAY (hydration-safe)
// import { FormattedDate } from '@/components/ui/formatted-date';
// // <FormattedDate date={ user.createdAt } formatStr = "MMM d, yyyy" />

// // With custom format
// // <FormattedDate date={ user.createdAt } formatStr = "PPP" />
// // <FormattedDate date={ user.createdAt } formatStr = "MMM d, yyyy 'at' h:mm a" />

// // ============================================
// // 2. BROWSER-ONLY CONTENT
// // ============================================

// // ❌ OLD WAY
// { typeof window !== 'undefined' && <ClientWidget /> }

// // ✅ NEW WAY
// import { ClientOnly } from '@/components/ui/client-only';
// <ClientOnly fallback={ <Skeleton className="h-20 w-full" />}>
//     <ClientWidget />
//     </ClientOnly>

// // ============================================
// // 3. CONDITIONAL RENDERING
// // ============================================

// // ✅ Using useHydrated hook
// import { useHydrated } from '@/hooks/useHydrated';

// function MyComponent() {
//     const isHydrated = useHydrated();

//     if (!isHydrated) {
//         return <Skeleton className="h-10 w-40" />;
//     }

//     return <ClientSpecificContent />;
// }

// // ============================================
// // 4. LOCALSTORAGE ACCESS
// // ============================================

// // ❌ OLD WAY (crashes on server)
// const value = localStorage.getItem('key');

// // ✅ NEW WAY
// import { safeLocalStorage } from '@/lib/hydration-utils';

// const storage = safeLocalStorage();
// if (storage) {
//     const value = storage.getItem('key');
// }

// // ============================================
// // 5. RANDOM VALUES
// // ============================================

// // ❌ OLD WAY (different on server vs client)
// <div id={ Math.random() }>...</div>

// // ✅ NEW WAY
// import { ClientOnly } from '@/components/ui/client-only';

// <ClientOnly>
//     <div id={ Math.random() }>...</div>
//         </ClientOnly>

// // ============================================
// // 6. TABLE WITH DATES (Complete Example)
// // ============================================

// import { FormattedDate } from '@/components/ui/formatted-date';
// import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

// function UsersTable({ users }) {
//     return (
//         <Table>
//         <TableBody>
//         {
//             users.map(user => (
//                 <TableRow key= { user.id } >
//                 <TableCell>{ user.name } </TableCell>
//                 < TableCell >
//                 <FormattedDate date={ user.createdAt } />
//                 </TableCell>
//             </TableRow>
//             ))
//         }
//         </TableBody>
//         </Table>
//     );
// }
