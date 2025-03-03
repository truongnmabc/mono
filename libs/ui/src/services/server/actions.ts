'use server';
import { cookies } from 'next/headers';
export async function finishTest(testId: number) {
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
