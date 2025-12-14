export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Email Marketing CRM
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Professional email marketing and CRM platform for managing contacts, campaigns,
          and analytics. Powerful tools for businesses of all sizes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/login"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition"
          >
            Register Your Company
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Campaigns</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create and manage professional email campaigns with advanced scheduling
            </p>
          </div>
          
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Management</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Organize contacts with custom fields and powerful segmentation
            </p>
          </div>
          
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics & Insights</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Track performance with detailed analytics and reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
