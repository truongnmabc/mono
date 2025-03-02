'use client';
import { ITopicBase } from '@ui/models/topics';
import React, { ReactNode } from 'react';
import { ITopicHomeProps } from '../home/gridTopic/gridTopics';

export interface IContextAllowExpand {
  color?: string;
  mainTopic?: ITopicHomeProps | null;
  mainTopicTag: string | null;
}

export const AllowExpandContext = React.createContext<IContextAllowExpand>({
  color: 'red',
  mainTopic: undefined,
  mainTopicTag: '',
});

const AllowExpandProvider = ({
  children,
  topic,
}: {
  children: ReactNode;
  topic: ITopicHomeProps | null;
}) => {
  const value = {
    mainTopic: topic,
    mainTopicTag: topic ? topic.tag : '',
  };

  return (
    <AllowExpandContext.Provider value={value}>
      {children}
    </AllowExpandContext.Provider>
  );
};
export default AllowExpandProvider;
