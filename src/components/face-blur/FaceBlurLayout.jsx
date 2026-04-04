export default function FaceBlurLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.45fr)_460px] gap-10 items-start">
      <div className="min-w-0">{left}</div>
      <div className="xl:self-start">{right}</div>
    </div>
  );
}
