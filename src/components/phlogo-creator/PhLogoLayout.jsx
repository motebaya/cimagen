export default function PhLogoLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_420px] gap-8 items-start">
      <div className="min-w-0">{left}</div>
      <div className="xl:self-start space-y-4">{right}</div>
    </div>
  );
}
