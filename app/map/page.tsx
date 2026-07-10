import InventoryMap from "@/components/InventoryMap";

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">All inventory</p>
      <h1 className="text-4xl mb-10">Map</h1>
      <InventoryMap />
    </div>
  );
}
