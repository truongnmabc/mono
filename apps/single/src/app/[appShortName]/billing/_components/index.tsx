"use client";
import { useAppSelector } from "@/redux/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import MyContainer from "@/components/container";
import ProPackage from "@/app/[appShortName]/get-pro/_components/proPackage";
import { db } from "@/db/db.model";
import { IPaymentInfos } from "@/models/payment/payment";
import { selectAppInfo } from "@/redux/features/appInfo.reselect";
import { selectInAppPurchasedInfo } from "@/redux/features/payment.reselect";
import { selectUserInfo } from "@/redux/features/user.reselect";
import "./index.scss";

const BillingPage = () => {
    const appInfo = useAppSelector(selectAppInfo);
    const userInfo = useAppSelector(selectUserInfo);
    const inAppSubscriptions = useAppSelector(selectInAppPurchasedInfo);

    const [listBill, setListBill] = useState<
        {
            date: string;
            period: string;
            plan?: string;
            amount: string;
            status: string;
        }[]
    >([]);
    const isDesktop = useMediaQuery("(min-width: 769px)");

    useEffect(() => {
        const handleGetData = async () => {
            if (userInfo.id) {
                const data = await db?.paymentInfos
                    .where("userId")
                    .equals(userInfo?.id)
                    .toArray();
                console.log("🚀 ~ handleGetData ~ data:", data);
                if (data) {
                    const listBill = convertData(data);
                    setListBill(listBill);
                }
            }
        };

        handleGetData();
    }, [userInfo?.id, appInfo]);

    let next_billing_time = "";
    if (listBill.length > 0) {
        next_billing_time = listBill[0].period.slice(
            15,
            listBill[0].period.length
        );
    }
    return (
        <div>
            <div style={{ overflow: "hidden" }}>
                <div className="pro-background">
                    {inAppSubscriptions.length > 0 && (
                        <div className="alert-in-app-purchased">
                            <Alert />
                            You made your purchase on our mobile app. If you
                            want to change or cancel your current plan, please
                            use the app to take action
                        </div>
                    )}
                    <h1>Account Info</h1>
                    {!!userInfo && (
                        <>
                            <p className="account-email">{userInfo.email}</p>
                            <ProPackage />
                        </>
                    )}
                </div>

                <MyContainer className="billing-history">
                    {!!userInfo && !!next_billing_time && (
                        <MyContainer className="next-billing-date">
                            <div className="line" />
                            Your next billing date is {next_billing_time}{" "}
                            <div className="line" />
                        </MyContainer>
                    )}
                    <span>Billing History </span>
                    <div className="table-billing">
                        <table>
                            <thead>
                                <tr>
                                    <th>{isDesktop ? "Date" : ""}</th>
                                    <th>Billing Period</th>
                                    <th>Plan Name</th>
                                    <th>
                                        {isDesktop ? "Amount (USD)" : "Amount"}
                                    </th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listBill.map((b, i) => (
                                    <tr key={i}>
                                        <td>
                                            {isDesktop ? b.date : <Period />}
                                        </td>
                                        <td>
                                            {isDesktop
                                                ? b.period
                                                : b.period
                                                      .split(" to ")
                                                      .map((p, _i) => (
                                                          <div key={_i}>
                                                              {p}
                                                          </div>
                                                      ))}
                                        </td>
                                        <td>{b.plan}</td>
                                        <td>{b.amount}</td>
                                        <td>{b.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {inAppSubscriptions.length > 0 && (
                        <>
                            <span>In-App Subscriptions</span>
                            <div className="table-billing">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{isDesktop ? "Date" : ""}</th>
                                            <th>Billing Period</th>
                                            <th>Os</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inAppSubscriptions.map((b, i) => {
                                            return b.in_app.map((_, __) => {
                                                const period =
                                                    _formatTime(
                                                        _.purchase_date
                                                    ) +
                                                    " to " +
                                                    _formatTime(_.expires_date);
                                                return (
                                                    <tr key={"" + i + __}>
                                                        <td>
                                                            {isDesktop ? (
                                                                _formatTime(
                                                                    _.purchase_date
                                                                )
                                                            ) : (
                                                                <Period />
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isDesktop
                                                                ? period
                                                                : period
                                                                      .split(
                                                                          " to "
                                                                      )
                                                                      .map(
                                                                          (
                                                                              p,
                                                                              _i
                                                                          ) => (
                                                                              <div
                                                                                  key={
                                                                                      _i +
                                                                                      "_"
                                                                                  }
                                                                              >
                                                                                  {
                                                                                      p
                                                                                  }
                                                                              </div>
                                                                          )
                                                                      )}
                                                        </td>
                                                        <td>{b.os}</td>
                                                        <td>
                                                            {
                                                                _.in_app_ownership_type
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </MyContainer>
            </div>
        </div>
    );
};

const convertData = (listTransaction: IPaymentInfos[]) => {
    return listTransaction.map((tran) => {
        return {
            date: _formatTime(tran.createdDate),
            period:
                _formatTime(tran.updateDate) +
                " to " +
                _formatTime(tran.expiredDate || ""),
            plan: tran.planName,
            amount: "$" + tran.amount,
            status: tran.status ?? "Cancelled",
        };
    });
};

const _formatTime = (time: string | number | Date) => {
    const dateString = new Date(time).toDateString();
    const p = dateString.split(" ");
    return p[1] + " " + p[2] + ", " + p[3];
};

const Period = () => {
    return (
        <svg
            width="16"
            height="41"
            viewBox="0 0 16 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7 26C7 26.5523 7.44771 27 8 27C8.55228 27 9 26.5523 9 26L7 26ZM7 16L7 26L9 26L9 16L7 16Z"
                fill="#212121"
                fillOpacity="0.08"
            />
            <circle
                cx="8"
                cy="8"
                r="5.5"
                fill="white"
                stroke="#45866F"
                strokeWidth="5"
            />
            <circle cx="8" cy="37" r="4" fill="white" />
            <circle
                cx="8"
                cy="37"
                r="2.5"
                stroke="#45866F"
                strokeOpacity="0.52"
                strokeWidth="3"
            />
        </svg>
    );
};

const Alert = () => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_2074_3279)">
                <path
                    d="M8.98219 1.56595C8.8832 1.39352 8.74047 1.25025 8.5684 1.15062C8.39633 1.051 8.20102 0.998535 8.00219 0.998535C7.80336 0.998535 7.60805 1.051 7.43598 1.15062C7.26391 1.25025 7.12118 1.39352 7.02219 1.56595L0.16519 13.233C-0.29181 14.011 0.25619 15 1.14519 15H14.8582C15.7472 15 16.2962 14.01 15.8382 13.233L8.98219 1.56595ZM8.00019 4.99995C8.53519 4.99995 8.95419 5.46195 8.90019 5.99495L8.55019 9.50195C8.53843 9.63972 8.47539 9.76806 8.37355 9.86159C8.2717 9.95511 8.13846 10.007 8.00019 10.007C7.86192 10.007 7.72868 9.95511 7.62683 9.86159C7.52499 9.76806 7.46195 9.63972 7.45019 9.50195L7.10019 5.99495C7.08762 5.86919 7.10153 5.74218 7.14104 5.62212C7.18054 5.50206 7.24475 5.3916 7.32953 5.29786C7.41432 5.20413 7.5178 5.12919 7.63331 5.07788C7.74882 5.02657 7.8738 5.00002 8.00019 4.99995ZM8.00219 11C8.26741 11 8.52176 11.1053 8.7093 11.2928C8.89683 11.4804 9.00219 11.7347 9.00219 12C9.00219 12.2652 8.89683 12.5195 8.7093 12.7071C8.52176 12.8946 8.26741 13 8.00219 13C7.73697 13 7.48262 12.8946 7.29508 12.7071C7.10755 12.5195 7.00219 12.2652 7.00219 12C7.00219 11.7347 7.10755 11.4804 7.29508 11.2928C7.48262 11.1053 7.73697 11 8.00219 11Z"
                    fill="#A16207"
                />
            </g>
            <defs>
                <clipPath id="clip0_2074_3279">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default BillingPage;
