import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@ui/asset/icon/CloseIcon';
import { MtUiButton } from '@ui/components/button';
import DialogResponsive from '@ui/components/dialogResponsive';
import { TypeParam } from '@ui/constants';
import RouterApp from '@ui/constants/router.constant';
import { db } from '@ui/db';
import { IGameMode, IGroupExam } from '@ui/models/tests/tests';
import { ITopicBase } from '@ui/models/topics';
import { updateFeedbackCustomTest } from '@ui/redux/features/game';
import { shouldOpenSetting } from '@ui/redux/features/tests';
import { useAppDispatch } from '@ui/redux/store';
import { fetchQuestionsForTopics, generateGroupExamData } from '@ui/utils/data';
import { generateRandomNegativeId } from '@ui/utils/math';
import { useRouter } from 'next/navigation';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { CardFeeBack } from './cardFeedBack';
import CardProgress from './cardProgress';
import CardTopic from './cardTopic';
import { ITopicHomeJson } from '@ui/models/other';

export type IFeedBack = 'newbie' | 'expert' | 'exam';

type IPropsUpdateDb = {
  totalDuration?: number;
  passingThreshold?: number;
  id: number;
  selectFeedback?: IFeedBack;
  topicIds?: number[];
  totalQuestion?: number;
  groupExamData?: IGroupExam[];
};

const handleSaveToDb = async (props: IPropsUpdateDb, isUpdate: boolean) => {
  let existingData = null;
  let index = 0;
  // Nếu là update, lấy dữ liệu cũ để giữ nguyên createData
  if (isUpdate) {
    existingData = await db?.testQuestions.get(props.id);
  }
  if (!isUpdate) {
    index =
      (await db?.testQuestions
        .where('gameMode')
        .equals(TypeParam.customTests)
        .count()) || 0;
  }
  const data = {
    totalDuration: props.totalDuration || existingData?.totalDuration || 0,
    passingThreshold:
      props.passingThreshold || existingData?.passingThreshold || 0,
    isGamePaused: false,
    id: props.id,
    startTime: isUpdate ? Date.now() : existingData?.startTime || Date.now(),
    gameMode: TypeParam.customTests as IGameMode,
    gameDifficultyLevel:
      props.selectFeedback || existingData?.gameDifficultyLevel,
    topicIds: props.topicIds || existingData?.topicIds || [],
    status: 0,
    attemptNumber: existingData?.attemptNumber ?? 1,
    elapsedTime: existingData?.elapsedTime ?? 0,
    totalQuestion: props.totalQuestion || existingData?.totalQuestion || 0,
    groupExamData: props.groupExamData || existingData?.groupExamData || [],
    index: isUpdate ? existingData?.index : index,
    createDate: isUpdate ? existingData?.createDate : Date.now(), // Giữ nguyên createData khi update
  };

  if (isUpdate) {
    await db?.testQuestions.update(data.id, { ...data });
  } else {
    await db?.testQuestions.add(data);
  }
};

const schema = yup.object().shape({
  selectFeedback: yup.string().oneOf(['newbie', 'expert', 'exam']).required(),
  count: yup.number().min(1, 'Must be at least 1').max(100).required(),
  duration: yup.number().min(0).max(90).required(),
  passing: yup.number().min(0).max(100).required(),
  selectListTopic: yup.array().min(1, 'Select at least one topic').required(),
  testId: yup.number().required(),
});

type IFormState = {
  selectFeedback: IFeedBack;
  count: number;
  duration: number;
  passing: number;
  selectListTopic: ITopicHomeJson[];
  testId: number;
};
const ModalSettingCustomTest = ({
  topics,
  isCurrentTest,
  isListEmpty,
  testId,
  isEdit,
}: {
  topics: ITopicHomeJson[];
  isCurrentTest?: boolean;
  isListEmpty?: boolean;
  testId?: number;
  isEdit?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormState>({
    resolver: yupResolver(schema),
    defaultValues: {
      selectFeedback: 'newbie',
      count: 34,
      duration: 30,
      passing: 70,
      selectListTopic: topics,
      testId: generateRandomNegativeId(),
    },
  });
  const selectListTopic = watch('selectListTopic');

  useEffect(() => {
    if (testId && testId !== -1) {
      const handleGetData = async () => {
        const item = await db?.testQuestions.get(testId);
        if (item) {
          setValue('selectFeedback', item.gameDifficultyLevel as IFeedBack);
          setValue('count', item.totalQuestion);
          setValue('duration', item.totalDuration);
          setValue('passing', item.passingThreshold);
          setValue(
            'selectListTopic',
            topics.filter((topic) => item.topicIds?.includes(topic.id)) || []
          );
          setValue('testId', item.id);
        }
      };
      handleGetData();
    }
  }, [testId, topics]);

  const handleClose = useCallback(() => {
    setOpen(false);

    dispatch(
      shouldOpenSetting({
        openModalSetting: false,
        testId: -1,
        isEdit: false,
      })
    );
  }, [isListEmpty, router, dispatch]);

  const handleRedirect = useCallback(() => {
    if (isListEmpty) {
      setTimeout(() => {
        router.push(RouterApp.Home, { scroll: true });
      }, 300);
    } else {
      handleClose();
    }
  }, [isListEmpty, router, handleClose]);

  const onSubmit = useCallback(
    async (data: IFormState) => {
      try {
        setLoading(true);
        const {
          count,
          duration,
          passing,
          selectFeedback,
          selectListTopic,
          testId,
        } = data;
        if (isCurrentTest) {
          await handleSaveToDb(
            {
              id: testId,
              selectFeedback: data.selectFeedback,
            },
            true
          );
          dispatch(
            updateFeedbackCustomTest({
              gameDifficultyLevel: data.selectFeedback,
            })
          );

          handleClose();
          return;
        }
        const countQuestionTopic = Math.floor(count / selectListTopic.length);

        const remainderQuestionTopic = count % selectListTopic.length;

        const [listTests, appInfos] = await Promise.all([
          isListEmpty
            ? []
            : db?.testQuestions
                .where('gameMode')
                .equals(TypeParam.customTests)
                .toArray(),
          db?.passingApp.get(-1),
        ]);

        const listQuestionIds = isListEmpty
          ? []
          : listTests?.flatMap((test) =>
              test.groupExamData.flatMap((item) => item.questionIds)
            ) || [];

        const listQuestion = await fetchQuestionsForTopics({
          selectListTopic: selectListTopic as ITopicBase[],
          countQuestionTopic,
          remainderQuestionTopic,
          excludeListID: listQuestionIds,
          target: count,
        });

        const ids = listQuestion?.map((item) => item.id);

        if (listQuestionIds?.length + ids?.length === appInfos?.totalQuestion) {
          toast.error('Not enough questions left to create this test');
          handleClose();
          return;
        }

        const groupExamData = await generateGroupExamData({
          questions: listQuestion,
          topics: selectListTopic as ITopicBase[],
        });

        await handleSaveToDb(
          {
            id: testId,
            passingThreshold: passing,
            topicIds: selectListTopic.map((t) => t.id),
            selectFeedback: selectFeedback,
            totalDuration: duration,
            totalQuestion: count,
            groupExamData,
          },
          isEdit || false
        );

        handleClose();
        dispatch(
          shouldOpenSetting({
            openModalSetting: false,
            isCurrentTest: isCurrentTest,
            isListEmpty: false,
            isEdit: false,
          })
        );
        if (!isEdit) {
          const param = queryString.stringify({
            type: TypeParam.customTests,
            testId,
          });
          setTimeout(() => {
            router.replace(`${RouterApp.Custom_test}?${param}`);
          }, 150);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    },
    [isCurrentTest, isListEmpty, router, dispatch, handleClose]
  );

  const handleSelectAll = useCallback(() => {
    setValue(
      'selectListTopic',
      selectListTopic.length === topics.length ? [] : topics
    );
  }, [topics, selectListTopic, setValue]);

  return (
    <DialogResponsive
      open={open}
      close={handleClose}
      dialogRest={{
        sx: {
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '900px',
            maxHeight: '1080px',
          },
        },
      }}
      sheetRest={{
        mask: true,
        height: 600,
        handler: true,
        swipeToClose: false,
        className: 'custom-sheet-handler',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col transition-all justify-between max-w-[900px]  h-full p-4 sm:p-6 bg-theme-white"
      >
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-2xl text-center w-full sm:text-start font-semibold">
              Customize Your Test
            </p>
            <button
              onClick={handleRedirect}
              type="button"
              className="w-8 h-8 cursor-pointer rounded-full bg-white flex items-center justify-center"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Feedback Modes */}
          <section className="mt-6">
            <p className="text-lg font-semibold">Feedback Modes</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['newbie', 'expert', 'exam'].map((type) => (
                <Controller
                  key={type}
                  name="selectFeedback"
                  control={control}
                  render={({ field }) => (
                    <CardFeeBack
                      text={`${
                        type.charAt(0).toUpperCase() + type.slice(1)
                      } Mode`}
                      type={type as IFeedBack}
                      select={field.value}
                      onSelect={field.onChange}
                      des={
                        type === 'newbie'
                          ? 'Answers and explanations are displayed immediately after each question.'
                          : type === 'expert'
                          ? 'Only answer accuracy is evaluated after each question. No explanation provided.'
                          : 'The final score is shown after answering all questions.'
                      }
                    />
                  )}
                />
              ))}
            </div>
          </section>

          {/* Test Settings */}
          <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Controller
              name="count"
              control={control}
              render={({ field }) => (
                <CardProgress
                  title="Question Count:*"
                  max={100}
                  defaultValue={field.value}
                  changeProgress={field.onChange}
                  required
                  errorMess={errors.count?.message}
                  disabled={isCurrentTest}
                />
              )}
            />
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <CardProgress
                  title="Duration:"
                  suffix="minutes"
                  max={90}
                  defaultValue={field.value}
                  disabled={isCurrentTest}
                  changeProgress={field.onChange}
                />
              )}
            />
            <Controller
              name="passing"
              control={control}
              render={({ field }) => (
                <CardProgress
                  title="Passing Score:"
                  suffix="%"
                  max={100}
                  defaultValue={field.value}
                  disabled={isCurrentTest}
                  changeProgress={field.onChange}
                />
              )}
            />
          </section>

          {/* Topics Selection */}
          <section className="mt-6 pb-1">
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold">Subjects*</p>
              <button
                type="button"
                className="underline cursor-pointer text-sm font-normal"
                onClick={handleSelectAll}
              >
                {selectListTopic.length === topics.length
                  ? 'Deselect All'
                  : 'Select All'}
                s
              </button>
            </div>
            <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-3">
              {topics.map((item) => (
                <CardTopic
                  key={item.id}
                  item={item}
                  disabled={isCurrentTest}
                  selectListTopic={selectListTopic}
                  setSelectListTopic={(newList) =>
                    setValue('selectListTopic', newList)
                  }
                />
              ))}
            </div>
            {errors.selectListTopic && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.selectListTopic.message}
              </p>
            )}
          </section>
        </div>

        <div className="flex pb-6 sm:pb-0 w-full mt-2 items-center justify-end gap-4">
          <MtUiButton
            className="sm:max-w-32"
            block
            size="large"
            onClick={handleClose}
            htmlType="button"
          >
            Cancel
          </MtUiButton>

          <MtUiButton
            size="large"
            type="primary"
            block
            htmlType="submit"
            className="sm:max-w-32"
            loading={loading}
          >
            {testId && testId !== -1 ? 'Update' : 'Start'}
          </MtUiButton>
        </div>
      </form>
    </DialogResponsive>
  );
};

export default ModalSettingCustomTest;
