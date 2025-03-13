import { MtUiButton } from '@ui/components/button';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
const Sheet = dynamic(() => import('@ui/components/sheet'), {
  ssr: false,
});
const list = [10, 20, 30, 40, 50, 60];
const SheetSelectQuestions = ({
  handleStartTest,
}: {
  handleStartTest: (e: number) => void;
}) => {
  const [value, setValue] = useState(40);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 200);
  }, []);
  const handleSelect = useCallback((value: number) => {
    setValue(value);
  }, []);

  const handleCancel = useCallback(() => {
    router.back();
    setIsOpen(false);
  }, []);

  const handleStart = useCallback(async () => {
    setIsOpen(false);
    handleStartTest(value);
  }, [value]);

  return (
    <Sheet visible={isOpen} onClose={handleCancel} autoHeight>
      <motion.div
        key="test-not-ready"
        exit={{ opacity: 0, y: 60 }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5, ease: 'easeOut' }}
        className="w-full rounded-lg bg-white "
        style={{
          boxShadow: '0px 2px 4px 0px #2121211F',
        }}
      >
        <div className="px-6 pb-6 flex flex-col gap-6">
          <p className="text-center text-xl px-6 font-semibold">
            How many questions do you want?
          </p>
          <div className="w-full flex items-center justify-between">
            {list.map((item) => (
              <div
                className={clsx(
                  ' rounded-full w-10 text-sm h-10  flex items-center justify-center ',
                  {
                    'bg-primary text-white': item === value,
                    'bg-[#21212114]': item !== value,
                  }
                )}
                key={item}
                onClick={() => handleSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="w-full flex items-center gap-4">
            <MtUiButton size="large" block onClick={handleCancel}>
              Cancel
            </MtUiButton>
            <MtUiButton size="large" block type="primary" onClick={handleStart}>
              Start
            </MtUiButton>
          </div>
        </div>
      </motion.div>
    </Sheet>
  );
};

export default SheetSelectQuestions;
