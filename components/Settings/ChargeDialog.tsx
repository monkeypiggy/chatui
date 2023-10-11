import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import HomeContext from '@/pages/api/home/home.context';
import { saveSettings } from '@/utils/app/settings';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChargeDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('charge');
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleCharge = async () => {
    try {
      const response = await fetch("https://pay.chatui.site/api/charge");

      if (!response.ok) {
        throw new Error("Failed to fetch the charge API");
      }

      const data = await response.json();
      const redirectUrl = data.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("URL not found in the response");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('充值')}
            </div>

            <div className="flex justify-between mb-4">
              <div
                className={`rounded-lg px-4 py-2 cursor-pointer ${selectedOption === 'option1' ? 'bg-yellow-500 text-black' : 'bg-gray-200'
                  }`}
                onClick={() => handleOptionClick('option1')}
              >
                1元
              </div>
              <div
                className={`rounded-lg px-4 py-2 cursor-pointer ${selectedOption === 'option2' ? 'bg-yellow-500 text-black' : 'bg-gray-200'
                  }`}
                onClick={() => handleOptionClick('option2')}
              >
                2元
              </div>
            </div>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleCharge();
                onClose();
              }}
            >
              {t('微信支付')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargeDialog;
