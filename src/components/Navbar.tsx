export default function Navbar() {
  return (
    <div className="w-full bg-white shadow h-16 px-6 flex items-center justify-between">
      <h2 className="font-semibold text-primary">Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-secondary rounded-full"></div>
      </div>
    </div>
  );
}
