export default function PokemonCardLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_440px] gap-8 items-start">
      <div className="min-w-0">{left}</div>
      <div className="xl:self-start space-y-4">{right}</div>
    </div>
  );
}
