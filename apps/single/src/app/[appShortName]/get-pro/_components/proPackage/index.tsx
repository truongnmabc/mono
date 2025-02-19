"use client";
import { MtUiButton } from "@/components/button";
import { ONETIME, PURCHASED } from "@/constants";
import RouterApp from "@/constants/router.constant";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectPaymentInfo } from "@/redux/features/payment.reselect";
import { shouldOpenModalLogin } from "@/redux/features/user";
import { selectUserInfo } from "@/redux/features/user.reselect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getConfigProV2, IPriceConfig } from "@/utils/paypal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PopupGetProPayment from "../popup/popupGetPro";
import ItemPrice from "./itemPrice";
import "./ProPackage.scss";

const ProPackage = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const paymentInfo = useAppSelector(selectPaymentInfo);
    const userInfo = useAppSelector(selectUserInfo);

    const [active, setActive] = useState<IPriceConfig | null>(null);
    const router = useRouter();
    const [prices, setPrices] = useState<IPriceConfig[]>([]);
    const [type, setType] = useState("");
    const [openModalUpgrade, setOpenModalUpgrade] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (appInfo) {
            const { prices, type } = getConfigProV2(appInfo);
            setPrices(prices);
            setActive(prices[1]);
            setType(type);
        }
    }, [appInfo]);

    // useEffect(() => {
    //     const getBilling = async () => {
    //         if (
    //             paymentInfo?.orderId &&
    //             isSubscriptionId(paymentInfo?.orderId) &&
    //             type === SUBSCRIPTION
    //         ) {
    //             let { orderInfo } = await getListTransactionAPI(
    //                 paymentInfo.orderId,
    //                 paymentInfo?.orderIds?.filter((id) => id) ?? []
    //             );
    //             setOrderInfo(orderInfo);
    //         }
    //     };

    //     getBilling();
    // }, [paymentInfo?.orderId]);

    const handleClickGetPro = useCallback(() => {
        if (!userInfo.id) {
            dispatch(shouldOpenModalLogin(true));
            return;
        }

        if (type === ONETIME) {
            if (paymentInfo?.buyPro === PURCHASED) {
                router.push(RouterApp.Billing);
                return;
            }
        }

        // *NOTE: Kiêm tra xem đã mua chưa
        // const orderIndex = prices.findIndex(
        //     (p) => p.planId === orderInfo?.plan_id
        // );
        // if (orderIndex > -1 && index <= orderIndex) {
        //     // nếu đã từng mua rồi thì chuyển sang trang billing
        //     router.push(_href);
        //     return;
        // }
        setOpenModalUpgrade(true);
    }, [userInfo, paymentInfo, dispatch, router, type]);

    const handleClose = useCallback(() => setOpenModalUpgrade(false), []);

    return (
        <div className="app-pro-package">
            <div className="max-w-page mx-auto w-full">
                <div className="flex items-center justify-center">
                    {prices.map((price, i) => (
                        <ItemPrice
                            price={price as IPriceConfig}
                            key={i}
                            active={
                                active && price.planId === active.planId
                                    ? true
                                    : false
                            }
                            handleActive={() => setActive(price)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center mt-6 justify-center w-full">
                <MtUiButton
                    className="text-white font-bold text-base text-center upgrade-btn v4-button-animation"
                    style={{
                        background:
                            "linear-gradient(93.11deg, #0bb177 0.93%, #3b6b5a 100%)",
                    }}
                    onClick={handleClickGetPro}
                >
                    Upgrade Now
                </MtUiButton>
            </div>

            {openModalUpgrade && userInfo && active && (
                <PopupGetProPayment
                    appInfo={appInfo}
                    onClose={handleClose}
                    valueButton={active}
                />
            )}
        </div>
    );
};

export default ProPackage;
