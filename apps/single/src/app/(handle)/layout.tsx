import BottomConfirmTest from '@ui/components/bottomConfirmEndTest';
import ModalConfirm from '@ui/components/modalConfirmStartTest';
import UserActionListen from '@ui/components/userAction';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full">
      {children}
      <BottomConfirmTest />
      <ModalConfirm />
      <UserActionListen />
    </section>
  );
}
