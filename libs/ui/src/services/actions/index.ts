'use server';

import { cookies } from 'next/headers';

export const useSetIsProServer = async () => {
  const coo = await cookies();
  coo.set('isPro', 'true');
};

export const useClearIsProServer = async () => {
  const coo = await cookies();
  coo.delete('isPro');
};
