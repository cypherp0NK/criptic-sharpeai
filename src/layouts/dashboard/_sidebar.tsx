import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Logo from '@/components/ui/logo';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import routes from '@/config/routes';
import { useDrawer } from '@/components/drawer-views/context';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { VoteIcon } from '@/components/icons/vote-icon';
import { Close } from '@/components/icons/close';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';
import { InfoCircle } from '@/components/icons/info-circle';
import { Sun } from '@/components/icons/sun';
import { Moon } from '@/components/icons/moon';
import sun from '@/components/icons/sun.png'
import Image from '@/components/ui/image';
import {AnalyticsIcon} from '@/components/icons/analytics'
import {Docs} from '@/components/icons/docs'


//images
import AuthorImage from '@/assets/images/author.jpg';
import { useTheme } from 'next-themes';
import { RadioGroup } from '@/components/ui/radio-group';


const menuItems = [
  {
    name: 'Dashboard',
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: 'Taurus',
    icon: <FarmIcon />,
    href: routes.taurus,
  },
  {
    name: 'Phantom',
    icon: <FarmIcon />,
    href: routes.phantom,
  },
  {
    name: 'Helios',
    icon: <FarmIcon />,
    href: routes.helios,
  },
  {
    name: 'Issue/Feedback',
    icon: <VoteIcon />,
    href: routes.feedback,
  },
  {
    name: 'Socials',
    icon: <ProfileIcon />,
    href: routes.socials,
  },
  {
    name: 'Analytics',
    icon: <PoolIcon />,
    href: routes.analytics,
  },
  {
    name: 'Documentation',
    icon: <DiskIcon />,
    href: routes.docs,
  },
];

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const { closeDrawer } = useDrawer();
  return (
    <aside
      className={cn(
        'top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80',
        className
      )}
    >
      <div className="relative flex h-24 items-center justify-between overflow-hidden px-6 py-4 2xl:px-8">
        <div className='pt-4 flex w-full flex-row items-center justify-center'><Logo /></div>
        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="px-6 pb-5 2xl:px-8">
          {/* <AuthorCard
            image={AuthorImage}
            name="Cameron Williamson"
            role="admin"
          /> */}

          <div className="mt-0">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
          {theme === "light" ? 
          <div className='relative hover:bg-brand dark:hover:text-white bottom-0 top-20 sm:top-12 w-fit mx-auto flex h-12 cursor-pointer items-center px-4 py-2.5 gap-2 transition-all text-gray-500 hover:text-brand dark:hover:text-white border border-transparent bg-txnTheme bg-opacity-10 hover:text-white rounded-lg'
          onClick={()=>{setTheme("dark")}}>
            <Moon />
            <div className='text-sm text-center'>Switch to dark</div>
          </div> : 
          <div className='relative bottom-0 top-20 sm:top-12 w-fit mx-auto flex h-12 cursor-pointer items-center px-4 py-2.5 gap-2 transition-all text-gray-500 hover:text-brand dark:hover:text-white border border-transparent bg-txnTheme bg-opacity-10 hover:text-white rounded-lg'
          onClick={()=>{setTheme("light")}}>
            {/* <div className="h-6 w-7 flex justify-center items-center"><Image src={sun} alt="Sharpe" /></div> */}
            <Sun />
            <div className='text-sm text-center'>Switch to light</div>
          </div>}
          <div className='relative bottom-0 top-24 sm:top-16 w-fit mx-auto flex text-xs items-center transition-all text-black dark:text-white'>v0.1.1</div>
        
        </div>
        
      </Scrollbar>
      
    </aside>
  );
}
