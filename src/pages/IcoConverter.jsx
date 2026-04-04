import SEO from "../components/SEO.jsx";
import IcoExportCard from "../components/ico-converter/IcoExportCard.jsx";
import IcoLayout from "../components/ico-converter/IcoLayout.jsx";
import IcoPreviewCard from "../components/ico-converter/IcoPreviewCard.jsx";
import IcoSettingsCard from "../components/ico-converter/IcoSettingsCard.jsx";
import IcoTopBar from "../components/ico-converter/IcoTopBar.jsx";
import useIcoConverter from "../hooks/ico-converter/useIcoConverter.js";

export default function IcoConverter(){const {exportCard,pageState,previewCard,settingsCard}=useIcoConverter();return <><SEO pageKey="icoConverter"/><div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" style={{maxWidth:"1760px",margin:"0 auto"}}><IcoTopBar/><div className="mb-8"><h1 className="text-2xl font-bold mb-1" style={{color:"var(--text-primary)"}}>Image to ICO Converter</h1><p className="text-sm" style={{color:"var(--text-tertiary)"}}>Convert images to .ico format with multiple sizes.</p></div>{pageState.error&&<div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in" style={{backgroundColor:"rgba(239, 68, 68, 0.08)",border:"1px solid rgba(239, 68, 68, 0.2)",color:"#ef4444"}}><span>{pageState.error}</span></div>}<IcoLayout left={<IcoPreviewCard {...previewCard}/>} right={<><IcoSettingsCard {...settingsCard}/><IcoExportCard {...exportCard}/></>}/></div></>;}
