import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PageContainer from '@/components/layout/PageContainer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1">
          <PageContainer fullWidth>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
