import { Slider } from "@/collection/ui/slider";
import { cn } from "@/lib/utils";

type SliderProps = React.ComponentProps<typeof Slider>;

export default function SliderDemo({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[25, 75]}
      maxValue={100}
      step={1}
      className={cn("w-[60%]", className)}
      label="Slider"
      {...props}
    />
  );
}
