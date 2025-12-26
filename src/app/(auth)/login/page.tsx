// Login Page
export default function LoginPage() {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign In to Email Marketing CRM
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose your login type
        </p>
      </div>
      
      <div className="space-y-4">
        <a
          href="/login/admin"
          className="block rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
        >
          Admin Login
        </a>
        
        <a
          href="/login/client"
          className="block rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition"
        >
          Client Login
        </a>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register your company
          </a>
        </p>
      </div>
    </div>
  );
}
