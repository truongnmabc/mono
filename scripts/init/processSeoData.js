import { getDataSeo } from '../utils/fetchData.js';

/**
 * 5. Hàm xử lý dữ liệu SEO
 * - Lấy dữ liệu SEO cho từng slug và chuyển thành object với key là tag
 * - Gộp thêm dữ liệu SEO mặc định cho các trang khác nếu không có dữ liệu
 */
async function processSeoData(slugs) {
  const dataSeoTest = await Promise.all(
    slugs.test.map(async (item) => {
      const data = await getDataSeo(item.slug);
      return { tag: item.tag, data };
    })
  );
  const seoTopic = dataSeoTest.reduce((result, item) => {
    result[item.tag] = {
      content: item?.data?.content,
      titleSeo: item?.data?.titleSeo[0],
      descSeo: item?.data?.descSeo[0],
    };
    return result;
  }, {});
  const dataSeoBranch = await Promise.all(
    slugs.branch.map(async (item) => {
      const data = await getDataSeo(item.slug);
      return { tag: item.tag, data };
    })
  );
  const seoBranch = dataSeoBranch.reduce((result, item) => {
    result[item.tag] = {
      content: item?.data?.content,
      titleSeo: item?.data?.titleSeo[0],
      descSeo: item?.data?.descSeo[0],
    };
    return result;
  }, {});
  const dataSeoFullLength = await getDataSeo(slugs.fullLength.slug);
  const dataSeoHome = await getDataSeo('home');
  const defaultSeo = {
    content: dataSeoHome?.content,
    titleSeo: dataSeoHome?.titleSeo[0],
    descSeo: dataSeoHome?.descSeo[0],
  };
  const seoNull = {
    content: '',
    titleSeo: '',
    descSeo: '',
  };
  return {
    rewrite: {
      test: seoTopic,
      branch: seoBranch,
      [slugs.fullLength.tag]: {
        content: dataSeoFullLength?.content,
        titleSeo: dataSeoFullLength?.titleSeo[0],
        descSeo: dataSeoFullLength?.descSeo[0],
      },
    },
    default: {
      home: defaultSeo,
      practiceTest: seoNull,
      diagnosticTest: seoNull,
      customTest: seoNull,
      review: seoNull,
    },
  };
}

export { processSeoData };
