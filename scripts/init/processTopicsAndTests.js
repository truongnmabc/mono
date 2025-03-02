export const listBranchTest = [
  {
    id: 1,
    title: 'marine',
  },
  {
    id: 2,
    title: 'navy',
  },
  {
    id: 3,
    title: 'army',
  },
  {
    id: 4,
    title: 'coast-guard',
  },
  {
    id: 5,
    title: 'air-force',
  },
  {
    id: 6,
    title: 'national-guard',
  },
];

/**
 * 2. Hàm xử lý dữ liệu topics và tests
 * - Tách riêng topics và tests từ topicsAndTest
 * - Tạo slug cho mỗi topic để phục vụ SEO
 */
function processTopicsAndTests(topicsAndTest, appShortName) {
  const topics = topicsAndTest.topic;
  const tests = topicsAndTest.tests;
  const slugs = topics.map((topic) => ({
    slug: `${appShortName}-${topic.tag}-practice-test`,
    tag: `${appShortName}-${topic.tag}-practice-test`,
  }));
  const branch = listBranchTest.map((item) => ({
    slug: `${item.title}-${appShortName}-practice-test`,
    tag: `${item.title}-${appShortName}-practice-test`,
  }));

  const listSlug = {
    test: [...slugs],
    branch: [...branch],
    fullLength: {
      slug: `full-length-${appShortName}-practice-test`,
      tag: `full-length-${appShortName}-practice-test`,
    },
  };

  return { topics, tests, slugs: listSlug };
}

export { processTopicsAndTests };
