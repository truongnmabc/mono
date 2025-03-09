import React from 'react';
import HeaderStudy from './headerStudy';
import LevelGameProgress from './levelGameProgress';
import { IGameMode } from '@ui/models/tests/tests';

const FN = ({ isActions, type }: { isActions?: boolean; type: IGameMode }) => {
  return (
    <div className="block sm:hidden w-full">
      <div className="w-full pb-1 sm:px-4 sm:py-2">
        <HeaderStudy type={type} />
      </div>
      <LevelGameProgress isActions={isActions} />
    </div>
  );
};

const HeaderMobile = React.memo(FN);

export default HeaderMobile;
