import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';

const ErrorPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Phantom"
        description="Sharpe - Structured Investment Products, For the World."
      />
      <div className="flex max-w-full flex-col items-center justify-center text-center"> 
          <Button shape="rounded">Coming Soon</Button>
      </div>
    </>
  );
};

ErrorPage.getLayout = function getLayout(page) {
  return (
    <DashboardLayout contentClassName="flex items-center justify-center">
      {page}
    </DashboardLayout>
  );
};

export default ErrorPage;
