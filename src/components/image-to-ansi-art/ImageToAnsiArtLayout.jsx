export default function ImageToAnsiArtLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_440px] gap-8 items-start">
      <div className="min-w-0">{left}</div>
      <div className="xl:self-start">{right}</div>
    </div>
  );
}
