import FinishLayout from '@ui/container/finish';

const FinishPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { topic, resultId, attemptNumber, index } = await searchParams;

  return (
    <FinishLayout
      topic={topic}
      resultId={Number(resultId)}
      attemptNumber={Number(attemptNumber)}
      index={index}
    />
  );
};

export default FinishPage;
