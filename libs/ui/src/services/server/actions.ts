'use server';
import { cookies } from 'next/headers';

export async function handleFinishTest(testId: number) {
  const cookieStore = await cookies();
  const completedTests = cookieStore.get('completed_tests');
  if (completedTests) {
    const completedTestsArray = JSON.parse(completedTests.value);
    cookieStore.set(
      'completed_tests',
      JSON.stringify([...completedTestsArray, testId])
    );
  } else {
    cookieStore.set('completed_tests', JSON.stringify([testId]));
  }
}

export async function removeCompletedTest({ id }: { id: number }) {
  const cookieStore = await cookies();
  const completedTests = cookieStore.get('completed_tests');
  if (completedTests) {
    const list = JSON.parse(completedTests.value);
    const updateList = list.filter((item: number) => item !== id);
    console.log('🚀 ~ removeCompletedTest ~ updateList:', updateList);
    cookieStore.set('completed_tests', JSON.stringify(updateList));
  }
}
