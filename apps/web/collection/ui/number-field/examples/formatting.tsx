import { NumberField } from "@/collection/ui/number-field";

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      <NumberField
        label="Adjust exposure"
        defaultValue={0}
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        }}
      />
      <NumberField
        label="Sales tax"
        defaultValue={0.05}
        formatOptions={{ style: "percent" }}
      />
      <NumberField
        label="Transaction amount"
        defaultValue={45}
        formatOptions={{
          style: "currency",
          currency: "EUR",
          currencyDisplay: "code",
          currencySign: "accounting",
        }}
      />
    </div>
  );
}
