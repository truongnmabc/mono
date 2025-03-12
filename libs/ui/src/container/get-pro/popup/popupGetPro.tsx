import Dialog from '@mui/material/Dialog';
import ProPlanSvg from '@ui/components/icon/ProPlanSvg';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo } from '@ui/models/app';
import { IPriceConfig } from '@ui/models/payment';
import { getConfigAppPro } from '@ui/utils/paypal';
import { useRouter } from 'next/navigation';
import PayPalBtn from '../paypalButton/payPalBtn';
import SubScriptionButton from '../paypalButton/subScriptionBtnPayment';
import './popupGetPro.scss';

export interface IButtonPropsV4 {
  price: string;
  value: number;
  stateValue: string;
  buttonContent?: string;
  isPdf?: boolean;
  mainTitlePopUp: string;
  valueName?: string;
  planId?: string;
  index: number;
}
const PopupGetProPayment = ({
  onClose,
  valueButton,
  appInfo,
}: {
  onClose: () => void;
  valueButton: IPriceConfig;
  appInfo: IAppInfo;
}) => {
  const appConfig = getConfigAppPro(appInfo.appShortName);
  const router = useRouter();
  const onPaymentSuccess = () => {
    router.push(RouterApp.Billing);
    onClose();
  };

  return (
    <Dialog
      className="pop-up-new-pro-pc"
      onClose={() => onClose()}
      open={true}
      PaperProps={{
        style: {
          borderRadius: '20px',
          maxHeight: '70vh',
          width: '100%',
        },
      }}
    >
      <div className="popup-new-pro">
        {!appConfig?.subscription && (
          <div className="title-popup">
            <ProPlanSvg />
            <span className="pro-plan">PRO PLAN</span>
          </div>
        )}

        <div className="popup-text">
          <div className="title-popup pro-title">Unlock all Features</div>
          <div className="price">
            Upgrade for <span>${valueButton.price.toString()}</span>
          </div>
        </div>

        {appConfig?.subscription ? (
          <SubScriptionButton
            paymentSuccess={onPaymentSuccess}
            valueButton={valueButton}
            appInfo={appInfo}
          />
        ) : (
          <PayPalBtn
            price={valueButton.price}
            paymentSuccess={onPaymentSuccess}
          />
        )}
      </div>
    </Dialog>
  );
};

export default PopupGetProPayment;
