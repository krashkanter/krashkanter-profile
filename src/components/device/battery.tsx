import { useBattery } from "@uidotdev/usehooks";

export default function BatteryComponent() {
  const { level, supported, charging } = useBattery();

  if (!supported) {
    return <p>🪫</p>;
  }

  return (
    <div>
      <p>
        🔋{charging ? "⚡️" : null}{" "}
        {level != null ? Math.round(100 * level) : 100}%
      </p>
    </div>
  );
}
