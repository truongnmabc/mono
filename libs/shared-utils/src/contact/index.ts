import { IContactInfo, listContactApp } from '../constant';

export const getContactApp = (appName: string): IContactInfo => {
  const lowerAppName = appName.toLowerCase();
  return (
    listContactApp[lowerAppName] || {
      facebook: '',
      youtube: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    }
  );
};
