import { Collapse, Grid2 } from '@mui/material';
import ItemTestLeft from '@ui/components/gridTests/itemTest';
import RouterApp from '@ui/constants/router.constant';
import { IAppInfo, ITestBase } from '@ui/models';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import CustomTestSvg from './itemGridTest/icon/iconCustomTest';
import DiagnosticTestSvg from './itemGridTest/icon/iconDiagnosticTest';
import FinalTestSvg from './itemGridTest/icon/iconFinalTest';
import PracticeTestsSvg from './itemGridTest/icon/iconPracticeTests';
import IconGridTest from '@ui/components/icon/iconGridTest';
import { TypeParam } from '@ui/constants';
export const mockGirdTests = [
  {
    id: 'DT',
    icon: <DiagnosticTestSvg />,
    name: 'Diagnostic Test',
    color: '#309F8C',
    href: RouterApp.Diagnostic_test,
  },
  {
    id: 'PT',
    icon: <PracticeTestsSvg />,
    name: 'Practice Tests',
    color: '#4797B1',
    href: RouterApp.Practice_Tests,
  },
  {
    id: 'FT',
    icon: <FinalTestSvg />,
    color: '#639CDD',
    name: 'Final Test',
    href: RouterApp.Final_test,
  },
  {
    id: 'CT',
    icon: <CustomTestSvg />,
    color: '#686EE2',
    name: 'Custom Test',
    href: RouterApp.Custom_test,
  },
];
const GridTest = ({
  appInfo,
  isMobile,
  practice,
  showList,
}: {
  appInfo: IAppInfo;
  isMobile: boolean;
  practice: ITestBase[];
  showList: boolean;
}) => {
  return (
    <div className="w-full mt-6 sm:mt-12">
      <h3 className="sm:text-[40px] sm:leading-[60px] text-center text-2xl font-bold">
        Take Full {appInfo.appName} Practice Test
      </h3>
      <h4 className="text-sm my-2 sm:mt-8 sm:text-base text-[#212121CC] sm:text-[#212121] font-normal  text-center">
        Ace your exam with our comprehensive practice tests! Get started with a
        Diagnostic Test to identify your strengths and weaknesses. Then, master
        the content with our Practice Tests. Finally, fine-tune your skills with
        the Final Test and Custom Test for ultimate confidence.
      </h4>
      <div className="w-full mt-6 sm:mt-10 ">
        <Grid2 container spacing={2}>
          {mockGirdTests.map((test) => (
            <Grid2
              size={{
                xs: 12,
                sm: 6,
                md: 6,
                lg: 3,
              }}
              key={test.id}
            >
              <Link
                href={
                  isMobile && test.id === 'PT'
                    ? `?selectTest=${showList ? 'false' : 'true'}`
                    : `${test.href}?id=${test.id}&type=${
                        test.id === 'PT'
                          ? TypeParam.practiceTest
                          : test.id === 'DT'
                          ? TypeParam.diagnosticTest
                          : test.id === 'FT'
                          ? TypeParam.finalTest
                          : TypeParam.customTest
                      }`
                }
                scroll={isMobile ? false : true}
              >
                <div
                  className={clsx(
                    'flex border p-2 relative hover:border-primary overflow-hidden bg-white cursor-pointer w-full h-[52px] sm:h-[72px] rounded-md'
                  )}
                >
                  <div
                    className="h-full aspect-square    rounded-md flex  items-center justify-center rounded-tl-md"
                    style={{
                      backgroundColor: test.color,
                    }}
                  >
                    <div className="w-5 h-5 sm:w-8 sm:h-8">{test.icon}</div>
                  </div>
                  <h3 className="pl-4 flex-1 text-base sm:text-lg  flex items-center justify-start font-medium ">
                    {test.name}
                  </h3>
                </div>
              </Link>
              {isMobile && test.id === 'PT' && (
                <Collapse
                  in={showList}
                  timeout="auto"
                  unmountOnExit
                  className="w-full mt-2"
                >
                  <div className="w-full flex  flex-col gap-2">
                    {practice?.map((test, index) => (
                      <Link
                        href={`${RouterApp.Practice_Tests}?testId=${test.id}`}
                        key={index}
                      >
                        <div
                          className={clsx(
                            'bg-white cursor-pointer p-2 hover:border-primary rounded-md border border-solid w-full flex items-center'
                          )}
                        >
                          <div className=" bg-primary-16 rounded-md p-[6px] h-full aspect-square flex items-center justify-center">
                            <IconGridTest />
                          </div>
                          <h3
                            className={clsx(
                              'text-xs  pl-3  pr-2 flex-1 truncate font-medium'
                            )}
                          >
                            Practice Tests {index + 1}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Collapse>
              )}
            </Grid2>
          ))}
        </Grid2>
      </div>
    </div>
  );
};

export default React.memo(GridTest);
