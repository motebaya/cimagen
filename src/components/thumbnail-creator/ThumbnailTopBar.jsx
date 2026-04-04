import HistoryPanel from "../HistoryPanel.jsx";
import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function ThumbnailTopBar({ historyPanel }) {
  return <CreatorTopBar right={<HistoryPanel {...historyPanel} />} />;
}
