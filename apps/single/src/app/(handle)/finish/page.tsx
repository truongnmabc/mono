import FinishLayout from '@ui/container/finish';

const FinishPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { topic, resultId, turn, index } = await searchParams;

  return (
    <FinishLayout
      topic={topic}
      resultId={Number(resultId)}
      turn={Number(turn)}
      index={index}
    />
  );
};

export default FinishPage;
