import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-stone-50 dark:bg-slate-900" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-4 py-8">
        {/* Logo — sits directly above the card, visually attached */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/email-logo.png"
            alt="BEE Smart Campaigns"
            width={140}
            height={50}
            priority
            className="object-contain"
          />
        </div>

        {children}
      </div>
    </div>
  );
}

// import Image from 'next/image';

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // <div className="relative flex min-h-screen items-center justify-center overflow-hidden">

// <div className="relative flex min-h-screen justify-center pt-20 overflow-hidden">
//     {/* Background */}
//       <div className="absolute inset-0 bg-stone-50 dark:bg-slate-900" />

//       {/* Subtle pattern overlay */}
//       <div
//         className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 w-full max-w-md px-6">
//         {/* Logo/Brand area */}
//         {/* <div className="mb-8 flex justify-center"> */}
//         <div className="mb-4 flex justify-center">

//                   <Image
//             // src="/images/logo.png"
//             src='/images/email-logo.png'
//             alt="BEE Smart Campaigns"
//             width={220}
//             height={80}
//             priority
//           />
//         </div>

//         {children}
//       </div>
//     </div>
//   );
// }
