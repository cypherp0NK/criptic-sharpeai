import type { NextPageWithLayout } from '@/types';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import routes from '@/config/routes';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import { ExportIcon } from '@/components/icons/export-icon';
import { Close as CloseIcon } from '@/components/icons/close';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
import emailjs from "emailjs-com"
// static data
import votePool from '@/assets/images/vote-pool.svg';

const actionOptions = [
  {
    name: 'Polygon address',
    value: 'polygon_address',
  }
];

const reserveOptions = [
  {
    name: 'Renounce Ownership',
    value: 'renounceOwnership',
  },
  {
    name: 'Set Rate Mantissa',
    value: 'setRateMantissa',
  },
  {
    name: 'Transfer Ownership',
    value: 'transferOwnership',
  },
  {
    name: 'Withdraw Reverse',
    value: 'withdrawReverse',
  },
];

const cripticTokenOptions = [
  {
    name: 'Approve',
    value: 'approve',
  },
  {
    name: 'Delegated',
    value: 'delegated',
  },
  {
    name: 'Mint',
    value: 'mint',
  },
  {
    name: 'Set Minter',
    value: 'setMinter',
  },
  {
    name: 'Transfer',
    value: 'transfer',
  },
  {
    name: 'Transfer From',
    value: 'transferFrom',
  },
];

function CripticTokenAction({
  selectedOption,
  onChange,
}: {
  selectedOption: ListboxOption;
  onChange: React.Dispatch<React.SetStateAction<ListboxOption>>;
}) {
  return (
    <>
      <Listbox
        className="w-full sm:w-80"
        options={cripticTokenOptions}
        selectedOption={selectedOption}
        onChange={onChange}
      />
      {selectedOption.value === 'approve' && (
        <>
          <Input
            label="Spender address"
            useUppercaseLabel={false}
            placeholder="Enter spender address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'delegated' && (
        <Input
          label="Delegated address"
          useUppercaseLabel={false}
          placeholder="Enter delegated address"
          className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
        />
      )}
      {selectedOption.value === 'mint' && (
        <>
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'setMinter' && (
        <Input
          label="Minter address"
          useUppercaseLabel={false}
          placeholder="Enter minter address"
          className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
        />
      )}
      {selectedOption.value === 'transfer' && (
        <>
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
      {selectedOption.value === 'transferFrom' && (
        <>
          <Input
            label="Src address"
            useUppercaseLabel={false}
            placeholder="Enter src address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Dst address"
            useUppercaseLabel={false}
            placeholder="Enter dst address"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
          <Input
            label="Raw amount unit256"
            useUppercaseLabel={false}
            placeholder="Enter rawAmount in unit256"
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
          />
        </>
      )}
    </>
  );
}

function ActionFields() {
  let [actionType, setActionType] = useState(actionOptions[0]);
  let [reserveAction, setReserveAction] = useState(reserveOptions[0]);
  let [cripticTokenAction, setCripticTokenAction] = useState(
    cripticTokenOptions[0]
  );
  
  return (
    <div className="">
      <div className="group mb-4 rounded-md bg-gray-100/90 p-5 pt-3 dark:bg-dark/60 xs:p-6 xs:pb-8">
        {/* <div className="-mr-2 mb-3 flex items-center justify-between">
          <h3 className="text-base font-medium dark:text-gray-100">
            Action #1
          </h3>
          <Button
            type="button"
            size="mini"
            shape="circle"
            variant="transparent"
            className="opacity-0 group-hover:opacity-100"
          >
            <CloseIcon className="h-auto w-[11px] xs:w-3" />
          </Button>
        </div> */}
        <>
          <Listbox
            className="w-full sm:w-80"
            options={actionOptions}
            selectedOption={actionType}
            onChange={setActionType}
          />
          {actionType.value === 'polygon_address' && (
            <Input
              className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
              useUppercaseLabel={false}
              placeholder="Enter contact address 0x1f9840a85..."
            />
          )}
          {actionType.value === 'eth_address' && (
            <Input
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
            useUppercaseLabel={false}
            placeholder="Enter contact address 0x1f9840a85..."
          />
          )}
          {actionType.value === 'fantom_address' && (
            <Input
            className="mt-4 ltr:xs:ml-6 rtl:xs:mr-6 ltr:sm:ml-12 rtl:sm:mr-12"
            useUppercaseLabel={false}
            placeholder="Enter contact address 0x1f9840a85..."
          />
          )}
        </>
      </div>
      {/* <Button variant="primary" className="mt-2 xs:mt-3 font-medium bg-transparent border-2 border-buttonMagenta text-buttonMagenta">
        Submit
      </Button> */}
    </div>
  );
}

const CreateProposalPage: NextPageWithLayout = () => {
  const form:any= useRef();
  const router = useRouter();
  const [titleMessage, setTitle] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [done, doneState] = useState<boolean>(false)

  const handleTitleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const tl = event.target.value === "" ? "" : (event.target.value)
    setTitle(tl)
  }
  const handleMessageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg = event.target.value === "" ? "" : (event.target.value)
    setMessage(msg)
  }
  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs.sendForm('service_57gw77f', 'template_aha4bo4', form.current, 't3wxstlKMsnutTXNi')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };
  function goToAllProposalPage() {
    setTimeout(() => {
      router.push(routes.proposals);
    }, 800);
  }
  return (
    <>
      <NextSeo
        title="Submit Feedback"
        description="Sharpe - Structured Investment Products, For the World."
      />
      <section className="mx-auto w-full max-w-[1160px] text-sm sm:pt-10 4xl:py-16">
        <header className="mb-10 flex flex-col gap-4 rounded-lg bg-white p-5 py-6 shadow-card dark:bg-light-dark xs:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 xs:gap-3 xl:gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-dark">
              <Image alt="Vote Pool" src={votePool} width={32} height={32} />
            </div>
            <div>
              <h2 className="mb-2 text-base font-medium uppercase dark:text-gray-100 xl:text-lg">
                ASK AWAY!
              </h2>
              <p className="leading-[1.8] text-gray-600 dark:text-gray-400">
                If you have any questions, Please view our Documentation or join us on our&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://discord.com/invite/tFAvMTw6Hx"
                  className="inline-flex items-center gap-2 text-gray-900 underline transition-opacity duration-200 hover:no-underline hover:opacity-90 dark:text-gray-100"
                >
                  Discord <ExportIcon className="h-auto w-3" />
                </a>
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              shape="rounded"
              fullWidth={true}
              className="uppercase bg-buttonMagenta"
              onClick={() => {window.location.href = "https://docs.sharpe.ai" }}
            >
              VIEW DOCUMENTATION
            </Button>
          </div>
        </header>

        <h2 className="mb-5 text-lg font-medium dark:text-gray-100 sm:mb-6 lg:mb-7 xl:text-xl">
          Please submit your feedback
        </h2>
        <form ref={form} onSubmit={sendEmail}>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          {/* <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Actions
          </h3> */}
          <p className="mb-5 leading-[1.8] dark:text-gray-300">
          Please enter your contract address
          </p>
          <ActionFields />
        </div>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Title
          </h3>
          {/* <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Your title introduces your proposal to the voters. Make sure it is
            clear and to the point.
          </p> */}
          <Input value={titleMessage} onChange={handleTitleChange} placeholder="Enter title of your Feedback" name='title' />
        </div>
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Description
          </h3>
          {/* <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Your description should present in full detail what the actions of
            the proposal will do. This is where voters will educate themselves
            on what they are voting on.
          </p> */}
          <Input
            value={message}
            type="textarea"
            onChange={handleMessageChange}
            placeholder="Add the Feedback details here"
            className="h-10 md:h-10 xl:h-10"
            name='message'
          />
        </div>
        <div className="mt-6">
          {
            done ? 
            <Button
            size="large"
            shape="rounded"
            fullWidth={true}
            className="xs:w-64 md:w-72 bg-txngreen"
          >
            Done!
          </Button>
             : <Button
            type="submit" value="Send"
            size="large"
            shape="rounded"
            fullWidth={true}
            className="xs:w-64 md:w-72 bg-buttonMagenta"
          >
            Submit Feedback
          </Button>
          }
          
        </div>
        </form>
      </section>
    </>
  );
};

CreateProposalPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateProposalPage;
