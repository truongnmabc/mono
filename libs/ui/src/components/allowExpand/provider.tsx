'use client';
import { ITopicHomeJson } from '@ui/models/other';
import React, { ReactNode } from 'react';

export interface IContextAllowExpand {
  color?: string;
  mainTopic?: ITopicHomeJson | null;
  mainTopicTag: string | undefined;
}

export const AllowExpandContext = React.createContext<IContextAllowExpand>({
  color: 'red',
  mainTopic: null,
  mainTopicTag: '',
});

const AllowExpandProvider = ({
  children,
  topic,
}: {
  children: ReactNode;
  topic: ITopicHomeJson | null;
}) => {
  const value = {
    mainTopic: topic,
    mainTopicTag: topic ? topic.slug : '',
  };

  return (
    <AllowExpandContext.Provider value={value}>
      {children}
    </AllowExpandContext.Provider>
  );
};
export default AllowExpandProvider;
