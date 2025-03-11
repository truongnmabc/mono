import FacebookIcon from '@ui/components/icon/FacebookIcon';
import LinkedinIcon from '@ui/components/icon/LinkedinIcon';
import TwitterIcon from '@ui/components/icon/TwitterIcon';
import YoutubeIcon from '@ui/components/icon/YoutubeIcon';
import { IAppConfigData } from '@ui/models/app';
import { getContactApp } from '@ui/utils';
import Link from 'next/link';

export const SocialsIcon = ({
  appName,
  appConfig,
}: {
  appName: string;
  appConfig: IAppConfigData;
}) => {
  const { facebook, twitter, youtube, linkedin } = getContactApp(appName);

  return (
    <div className="socials-icon">
      {facebook && (
        <Link target="_blank" href={facebook}>
          <FacebookIcon color="#fff" colorApp={appConfig.mainColorBold} />
        </Link>
      )}
      {twitter && (
        <Link target="_blank" href={twitter}>
          <TwitterIcon color="#fff" colorApp={appConfig.mainColorBold} />
        </Link>
      )}
      {youtube && (
        <Link target="_blank" href={youtube}>
          <YoutubeIcon color="#fff" colorApp={appConfig.mainColorBold} />
        </Link>
      )}
      {linkedin && (
        <Link target="_blank" href={linkedin}>
          <LinkedinIcon color="#fff" colorApp={appConfig.mainColorBold} />
        </Link>
      )}
    </div>
  );
};
