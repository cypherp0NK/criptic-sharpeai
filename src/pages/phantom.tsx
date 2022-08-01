import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import ErrorLightImage from '@/assets/images/404-light.svg';
import ErrorDarkImage from '@/assets/images/404-dark.svg';


const ErrorPage: NextPageWithLayout = () => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  return (
    <>
      <NextSeo
        title="Phantom"
        description="React Next Web3 NFT Crypto Dashboard Template"
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
