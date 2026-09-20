import { ProgressBar } from "../../components/ui";

export default function ProduccionPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Producción</h1>

      <ProgressBar
        value={25}
        max={100}
        variant="primary"
        showLabel
      />

      <ProgressBar
        value={50}
        max={100}
        variant="warning"
        showLabel
      />

      <ProgressBar
        value={100}
        max={100}
        variant="success"
        showLabel
      />

      <ProgressBar
        value={30}
        max={100}
        variant="destructive"
        showLabel
      />
    </div>
  );
}