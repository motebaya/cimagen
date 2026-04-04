import HistoryPanel from "../HistoryPanel.jsx";
import CreatorTopBar from "../creator/CreatorTopBar.jsx";

export default function DuotoneTopBar({ historyPanel }) {
  return <CreatorTopBar right={<HistoryPanel {...historyPanel} />} />;
}
