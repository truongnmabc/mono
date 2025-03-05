'use client';
import Loading from '@ui/components/loading';
import { axiosRequest } from '@ui/services/config/axios';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

interface IReview {
  id: string;
  userName: string;
  rating: number;
  content: string;
  avatar?: string;
  reviewDate: string;
}
const formatDate = (date: string) => {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return date;
  }
};
const ReviewCard = ({ review }: { review: IReview }) => (
  <div className="flex-[0_0_200px] sm:flex-[0_0_400px] mx-3 sm:mx-6">
    <div className="bg-white border overflow-hidden border-[#615F4662] border-solid rounded-xl p-4 sm:p-6 shadow-md h-[250px] flex flex-col">
      <div className="flex items-center gap-2 sm:gap-4 mb-2">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl">
            {review.userName.charAt(0)}
          </div>
        </div>
        <div>
          <p className="  text-base font-medium line-clamp-1">
            {review.userName}
          </p>
          <p className=" text-sm sm:text-base font-nomal  pt-1">
            {formatDate(review.reviewDate)}
          </p>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm sm:text-base  line-clamp-4 font-normal">
          {review.content}
        </p>
      </div>
      <div className="flex pt-1 items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-primary' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  </div>
);

const ListReview = () => {
  const [listReview, setListReview] = useState<{
    firstHalf: IReview[];
    secondHalf: IReview[];
  }>({
    firstHalf: [],
    secondHalf: [],
  });
  const slug = process.env.NEXT_PUBLIC_APP_SHORT_NAME;

  // Carousel trượt sang phải
  const [emblaRef1] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps',
    },
    [AutoScroll({ playOnInit: true, speed: 1 })]
  );

  // Carousel trượt sang trái
  const [emblaRef2] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps',
      direction: 'rtl', // Đảo ngược hướng
    },
    [AutoScroll({ playOnInit: true, speed: 1 })]
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchListReview = async () => {
      setLoading(true);
      try {
        const data = await axiosRequest({
          method: 'post',
          url: 'https://api-cms-v2-dot-micro-enigma-235001.appspot.com/api/app-rating/get-app-good-rating-reviews',
          data: {
            appKey: slug,
          },
        });
        const list = data.data;
        setListReview({
          firstHalf: list.slice(0, Math.ceil(list.length / 2)),
          secondHalf: list.slice(Math.ceil(list.length / 2)),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListReview();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      </div>
    );
  }
  return (
    <div className="py-12">
      {/* Carousel trượt sang phải */}
      <div className="overflow-hidden" ref={emblaRef1}>
        <div className="flex">
          {listReview.firstHalf.map((review: IReview) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Carousel trượt sang trái */}
      <div className="overflow-hidden mt-6 sm:mt-12" ref={emblaRef2}>
        <div className="flex flex-row-reverse">
          {listReview.secondHalf.map((review: IReview) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListReview;
