'use client';
import { Tooltip } from '@mui/material';
import {
  IconDelete,
  IconEdit,
  IconPlus,
} from '@ui/components/icon/iconGridLeft';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { ITestBase } from '@ui/models/tests';
import { shouldOpenSetting } from '@ui/redux/features/tests';
import { selectShouldOpenSetting } from '@ui/redux/features/tests.reselect';
import { useAppDispatch, useAppSelector } from '@ui/redux/store';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import ModalDelete from '../modalDelete';
const GridLeftCustomTest = ({ testId: id }: { testId: number }) => {
  const [listTest, setListTest] = useState<ITestBase[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [itemSelect, setItemSelect] = useState<number>(-1);
  const [testId, setTestId] = useState(id);
  const [isLoading, setIsLoading] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const setting = useAppSelector(selectShouldOpenSetting);

  useEffect(() => {
    if (id === -1) {
      const currentTest = listTest?.find((item) => item.status === 0);
      if (currentTest) setTestId(currentTest.id);
    }
    if (id !== -1) setTestId(id);
  }, [id, listTest]);
  useEffect(() => {
    const handleGetData = async () => {
      const list = await db?.testQuestions
        .where('gameMode')
        .equals(TypeParam.customTests)
        .sortBy('createDate');

      const listTest = list?.filter((item) => item.status !== -1);
      if (listTest?.length) setListTest(listTest);
    };
    if (!setting.openModalSetting) handleGetData();
  }, [isLoading, setting]);

  const handleDelete = useCallback(async () => {
    if (itemSelect) {
      await db?.testQuestions.update(itemSelect, {
        status: -1,
      });
      setIsLoading((prev) => prev + 1);
      setOpenDelete(false);
    }
  }, [itemSelect, dispatch]);

  const handleClickChoiceTest = useCallback(
    async (item: ITestBase, index: number) => {
      const tests = await db?.testQuestions.get(item.id);
      if (tests?.status === 1) {
        const param = queryString.stringify({
          gameMode: TypeParam.customTests,
          attemptNumber: tests?.attemptNumber,
          resultId: item?.id,
        });

        router.replace(`${RouterApp.ResultTest}?${param}`);
        return;
      }

      const param = queryString.stringify({
        type: TypeParam.customTests,
        testId: item?.id,
      });

      router.replace(`${RouterApp.Custom_test}?${param}`);
    },
    [dispatch, router]
  );

  const handleAddCustomTest = useCallback(() => {
    dispatch(
      shouldOpenSetting({
        openModalSetting: true,
      })
    );
  }, []);

  const handleEditTest = useCallback(
    (item: ITestBase) => {
      dispatch(
        shouldOpenSetting({
          openModalSetting: true,
          testId: item.id,
          isCurrentTest: testId === item.id,
          isEdit: true,
        })
      );
    },
    [testId]
  );
  const handleDeleteTest = useCallback((item: ITestBase) => {
    setOpenDelete(true);
    setItemSelect(item.id);
  }, []);

  const handleCloseModalDelete = useCallback(() => {
    setOpenDelete(false);
    setItemSelect(-1);
  }, []);

  return (
    <Fragment>
      <Fragment>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl">Custom Test</p>
          <Tooltip title="Add Custom Test">
            <div
              onClick={handleAddCustomTest}
              className="w-7 h-7 cursor-pointer rounded-full bg-[#21212114] flex items-center justify-center "
            >
              <IconPlus />
            </div>
          </Tooltip>
        </div>
        {listTest?.length ? (
          <div className="flex flex-col gap-3 bg-white p-4 rounded-md">
            {listTest?.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  'flex bg-[#2121210A]   border border-solid rounded-lg px-3 py-[10px] gap-2 justify-between items-center',
                  {
                    'border-primary': testId === item.id,
                  }
                )}
              >
                <Tooltip
                  title={
                    testId !== item.id ? `Start Custom Test ${index + 1}` : ''
                  }
                >
                  <p
                    className={clsx(
                      'text-sm hover:text-primary cursor-pointer font-medium',
                      {
                        'pointer-events-none': testId === item.id,
                      }
                    )}
                    onClick={() => {
                      handleClickChoiceTest(item, index + 1);
                    }}
                  >
                    Custom Test {(item?.index || 0) + 1}
                  </p>
                </Tooltip>

                <div className="flex items-center gap-2">
                  <Tooltip title="Edit">
                    <div
                      onClick={() => {
                        handleEditTest(item);
                      }}
                      className={clsx(
                        'w-6 h-6 rounded flex cursor-pointer hover:bg-primary items-center justify-center bg-[#2121210F]'
                      )}
                    >
                      <IconEdit />
                    </div>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <div
                      onClick={() => {
                        handleDeleteTest(item);
                      }}
                      className={clsx(
                        'w-6 h-6 rounded flex items-center hover:bg-primary cursor-pointer justify-center bg-[#2121210F]',
                        {
                          'pointer-events-none': testId === item.id,
                        }
                      )}
                    >
                      <IconDelete />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </Fragment>
      {openDelete && (
        <ModalDelete
          openDelete={openDelete}
          handleClose={handleCloseModalDelete}
          handleDelete={handleDelete}
        />
      )}
    </Fragment>
  );
};

export default React.memo(GridLeftCustomTest);
