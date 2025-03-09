import Link from 'next/link';

const ItemDrawerFullTest = ({
  name,
  href,
  handleClick,
  blank,
}: {
  name: string;
  href: string;
  blank: boolean;
  handleClick: () => void;
}) => {
  return (
    <Link href={href} target={blank ? '_blank' : ''} onClick={handleClick}>
      <div className="cursor-pointer p-3 font-poppins text-xl sm:text-2xl font-semibold">
        {name}
      </div>
    </Link>
  );
};

export default ItemDrawerFullTest;
