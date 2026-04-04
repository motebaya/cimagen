import HistoryPanel from "../HistoryPanel.jsx";
import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function StatisticFrameTopBar({ historyPanel }) {
  return <CreatorTopBar right={<HistoryPanel {...historyPanel} />} />;
}
