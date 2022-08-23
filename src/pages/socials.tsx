import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Image from '@/components/ui/image';
// static data
import twitter from '@/assets/images/twitter.svg'
import discord from '@/assets/images/discord.svg';
import docs from '@/assets/images/docs.svg'
import medium from '@/assets/images/medium.svg'
import github from '@/assets/images/github.svg'
import angellist from '@/assets/images/angellist.svg'

const VotePage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <NextSeo
        title="Socials"
        description="Sharpe - Structured Investment Products, For the World."
      />
      <h1 className="text-2xl font-medium dark:text-gray-100 mb-3">Socials</h1>
      <div className="mx-auto w-full max-w-[1160px] text-sm md:pt-7 4xl:pt-12">
      
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-4">
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/sharpe_ai"
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:col-span-2 sm:col-auto sm:row-span-2"
          >
            <div className="h-auto w-16 xs:w-20 xl:w-24 3xl:w-28 4xl:w-auto">
              <Image alt="Vote Pool" src={twitter} />
            </div>
            <h3 className="mt-6 mb-2 text-sm font-medium uppercase text-gray-800 dark:text-gray-100 sm:text-base 3xl:text-lg">
              FOLLOW US ON TWITTER
            </h3>
            {/* <p className="leading-loose text-gray-600 dark:text-gray-400">
              Vote with POOL tokens held{' '}
              <br className="hidden xs:inline-block" /> in your wallet or
              delegated <br className="hidden xs:inline-block" /> to you.
            </p> */}
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.com/invite/tFAvMTw6Hx"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-12 sm:w-auto">
              <Image alt="Discord" src={discord} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-purple-600 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Chat on Discord
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://sharpeai.medium.com/"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-12 sm:w-auto">
              <Image alt="Medium" src={medium} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-orange-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              View Blog
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://angel.co/company/sharpeai"
            className="cursor-pointer rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <div className="h-auto w-12 sm:w-auto">
              <div className='bg-white flex justify-center items-center w-fit h-fit rounded-full'><Image alt="careers" src={angellist} /></div>
            </div>
            <h3 className="mt-6 h-fit text-sm font-medium uppercase text-blue-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Careers
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/SharpeAI"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-12 sm:w-auto">
              <Image alt="github" src={github} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-blue-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              View Github
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://dune.com/sharpeai/sharpe-vault"
            className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <span className="inline-block h-auto w-11 sm:w-auto">
              <Image alt="Analytics" src={github} />
            </span>
            <h3 className="mt-6 text-sm font-medium uppercase text-gray-400 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              Analytics
            </h3>
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.015 }}
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.sharpe.ai/"
            className="cursor-pointer rounded-lg bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark"
          >
            <div className="h-auto w-12 sm:w-auto">
              <Image alt="Docs" src={docs} />
            </div>
            <h3 className="mt-6 text-sm font-medium uppercase text-blue-500 sm:mt-8 sm:text-base 3xl:mt-11 3xl:text-lg">
              View Documentation
            </h3>
          </motion.a>
        </div>
      </div>
    </>
  );
};

VotePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default VotePage;
