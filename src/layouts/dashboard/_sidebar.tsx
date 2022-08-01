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


//images
import AuthorImage from '@/assets/images/author.jpg';
import { useTheme } from 'next-themes';
import { RadioGroup } from '@/components/ui/radio-group';


const styles = {
  container: {
    paddingLeft: '1rem',
    paddingTop: '1rem',
    
  }
}
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
    name: 'Issue/ Feedback',
    icon: <VoteIcon />,
    href: routes.feedback,
  },
  {
    name: 'Socials',
    icon: <ProfileIcon />,
    href: routes.socials,
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
        <div style={styles.container}><Logo /></div>
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

          <div className="mt-12">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>

        <div>
          <RadioGroup className="mt-4"
        value={theme}
        onChange={setTheme}
        
      >
        <RadioGroup.Option value="light">
        {({ checked }) => (
            <div className="group cursor-pointer">
              <span
                className={`flex h-[30px] items-center justify-center rounded-lg text-center text-sm font-medium uppercase tracking-wide transition-all ${
                  checked
                    ? 'bg-white shadow-large dark:bg-gray-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700'
                }`}
              ><Sun />
              </span>
              
            </div>)}
        </RadioGroup.Option>
        <RadioGroup.Option value="dark">
        {({ checked }) => (
            <div className="group cursor-pointer">
              <span
                className={`mt-2 flex h-[30px] items-center justify-center rounded-lg text-center text-sm font-medium uppercase tracking-wide transition-all ${
                  checked
                    ? 'bg-white shadow-large dark:bg-gray-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700'
                }`}
              ><Moon />
              </span>
              
            </div>)}
        </RadioGroup.Option>


      </RadioGroup>
          </div>
        </div>
        
      </Scrollbar>
      
    </aside>
  );
}
