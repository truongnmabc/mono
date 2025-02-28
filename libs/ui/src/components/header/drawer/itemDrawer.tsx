import Link from 'next/link';

const ItemDrawerFullTest = ({
  name,
  href,
  handleClick,
}: {
  name: string;
  href: string;
  handleClick: () => void;
}) => {
  return (
    <Link href={href} onClick={handleClick}>
      <div className="cursor-pointer p-3 font-poppins text-2xl font-semibold">
        {name}
      </div>
    </Link>
  );
};

export default ItemDrawerFullTest;
