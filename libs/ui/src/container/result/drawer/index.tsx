import IconBack from '@ui/components/icon/iconBack';
import ReviewAnswerResult from '@ui/components/reviewAnswers';
import Drawer from '@mui/material/Drawer';
import { useResultContext } from '../resultContext';

type IProps = {
  openDrawer: boolean;
  handleCloseDrawer: () => void;
};
const DrawerAnswers = ({ openDrawer, handleCloseDrawer }: IProps) => {
  const { tableData, setTableData, listTopic, correctIds, topics } =
    useResultContext();
  return (
    <Drawer
      open={openDrawer}
      onClose={handleCloseDrawer}
      anchor="right"
      sx={{
        '& .MuiDrawer-paper': {
          left: 0,
        },
      }}
    >
      <div className="w-full flex flex-col gap-4 h-full p-4">
        <div className="flex items-center justify-between">
          <div onClick={handleCloseDrawer}>
            <IconBack />
          </div>
          <p className="text-base font-semibold">Review Your Answers</p>
          <p></p>
        </div>

        <div className="flex-1">
          <ReviewAnswerResult
            tableData={tableData}
            setTableData={setTableData}
            listTopic={listTopic}
            correctIds={correctIds}
            type="custom"
            isMobile={true}
            topics={topics}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerAnswers;
