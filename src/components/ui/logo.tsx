import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
// import lightLogo from '@/assets/images/logo.svg';
// import darkLogo from '@/assets/images/logo-white.svg';
import sharpelightlogo from './sharpelightlogo.png';
import sharpedarklogo from './sharpedarklogo.png';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();

  return (
    <AnchorLink
      href="/"
      className="flex w-28 outline-none sm:w-32 4xl:w-36"
      {...props}
    >
      <span className="relative flex overflow-hidden">
        {isMounted && isDarkMode && (
          <Image src={sharpedarklogo} alt="Sharpe" priority />
        )}
        {isMounted && !isDarkMode && (
          <Image src={sharpelightlogo} alt="Sharpe" priority />
        )}
      </span>
    </AnchorLink>
  );
};

export default Logo;
