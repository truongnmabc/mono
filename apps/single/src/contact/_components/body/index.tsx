import { IAppInfo } from '@ui/models/app';
import React from 'react';
import FaqAsvab from '../asvab/faqAsvab';
import FaqCDL from '../cdl/faqCDL';
import './index.scss';

export interface IFAQData {
  question: string;
  answer: string | React.ReactNode;
}

const BodyComponent = ({ appInfo }: { appInfo: IAppInfo }) => {
  const returnFaq = () => {
    switch (appInfo.appName.toLocaleLowerCase()) {
      case 'cdl':
        return <FaqCDL />;

      case 'asvab':
        return <FaqAsvab />;

      default:
        return null;
    }
  };
  return (
    <div className="contact-body-component max-w-component-desktop">
      <div className="contact-body-container">
        <div className="title">FAQs</div>
        {returnFaq()}
      </div>
    </div>
  );
};

export default BodyComponent;
