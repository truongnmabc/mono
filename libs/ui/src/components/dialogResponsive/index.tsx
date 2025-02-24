import Dialog, { DialogProps } from '@mui/material/Dialog';
import { SheetProps } from '@ui/components/sheet';
import { useIsMobile } from '@ui/hooks/useIsMobile';
import dynamic from 'next/dynamic';
import React from 'react';
const Sheet = dynamic(() => import('@ui/components/sheet'), {
  ssr: false,
});

export interface IDialogResponsive {
  open: boolean;
  close: () => void;
  sheetRest?: Omit<SheetProps & React.RefAttributes<HTMLDivElement>, 'visible'>;
  dialogRest?: Omit<DialogProps, 'open'>;
  children: React.ReactNode;
}

const DialogResponsive: React.FC<IDialogResponsive> = ({
  open,
  close,
  children,
  sheetRest = {},
  dialogRest = {},
}) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Sheet visible={open} onClose={close} {...sheetRest}>
        {children}
      </Sheet>
    );
  }
  return (
    <Dialog open={open} onClose={close} {...dialogRest}>
      {children}
    </Dialog>
  );
};

export default DialogResponsive;
