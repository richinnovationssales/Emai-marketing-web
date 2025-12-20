import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PageContainer from '@/components/layout/PageContainer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden md:block w-64 shrink-0 fixed left-0 top-0 pt-16">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-64 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)', paddingBottom: '2rem' }}>
          <PageContainer fullWidth>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
