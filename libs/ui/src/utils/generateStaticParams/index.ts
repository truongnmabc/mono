type DataType = Record<string, { slug: string }[]>;

const listRewrite: DataType = {
  asvab: [
    {
      slug: 'asvab-arithmetic-reasoning-practice-test',
    },
    {
      slug: 'asvab-assembling-objects-practice-test',
    },
  ],
};

export const generateListRewrite = async (appName: string) => {
  return listRewrite[appName];
};

export const generateDataPage = async (slug: string) => {
  return {
    title: 'ASVAB Arithmetic Reasoning Practice Test',
    content:
      'This is the content of the ASVAB Arithmetic Reasoning Practice Test',
  };
};
