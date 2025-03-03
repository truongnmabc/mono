import QuestionResult from '@ui/components/questionReview';
import { ICurrentGame } from '@ui/models/game';
interface TabPanelProps {
  index: number;
  value: number;
  data: ICurrentGame[];
  type?: 'default' | 'custom';
}

function TabPanelReview(props: TabPanelProps) {
  const { value, index, data, type } = props;

  if (value === index) {
    // return (
    //     <VariableSizeList
    //         data={data}
    //         getItemSize={getItemSize}
    //         item={(item) => <QuestionResult item={item} type={type} />}
    //     />
    // );

    return (
      <div>
        {data?.map((item) => (
          <div key={item.id} className="py-2">
            <QuestionResult item={item} type={type} />
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default TabPanelReview;
