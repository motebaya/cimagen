export default function BlueArchiveLogoLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_420px] gap-8 items-start">
      <div className="min-w-0">{left}</div>
      <div className="space-y-4">{right}</div>
    </div>
  );
}
