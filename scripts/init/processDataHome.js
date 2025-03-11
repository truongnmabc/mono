export function processDataHome({
  seo,
  topics,
  diagnosticTestId,
  branchTest,
  practiceTests,
  finalTestsId,
  appShortName,
}) {
  const dataHome = {
    seo: seo,
    topics: topics.map((item) => {
      const slug = appShortName + '-' + item.tag + '-' + 'practice-test';
      return {
        id: item.id,
        icon: item.icon,
        name: item.name,
        slug: slug,
        orderIndex: item.orderIndex,
        topics: item.topics.map((t) => ({
          id: t.id,
          icon: t.icon,
          name: t.name,
          slug: slug,
          orderIndex: t.orderIndex,

          topics: t.topics.map((tt) => ({
            id: tt.id,
            icon: tt.icon,
            name: tt.name,
            slug: slug,
            topics: [],
            orderIndex: tt.orderIndex,
          })),
        })),
      };
    }),
    tests: {
      finalTests: {
        id: 'FT',
        testId: finalTestsId,
      },
      practiceTests: {
        id: 'PT',
        list: practiceTests.map((item, index) => ({
          id: item.id,
          name: `Practice Test ${index + 1}`,
          slug: appShortName + '-' + 'practice-test' + '-' + (index + 1),
        })),
      },
      diagnosticTest: {
        id: 'DT',
        testId: diagnosticTestId,
      },
      branchTest: {
        id: 'BT',
        list: branchTest,
      },
    },
  };

  return dataHome;
}
