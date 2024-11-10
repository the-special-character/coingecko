import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai";
import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator as withStorageValidator,
} from "jotai/utils";
import { z } from "zod";

const BooleanSchema = z.boolean();

const isBoolean = (v: unknown): v is boolean =>
  BooleanSchema.safeParse(v).success;

const toggleHighlight = atomWithStorage(
  "highlight",
  false,
  withStorageValidator(isBoolean)(createJSONStorage())
);

const Highlights = () => {
  const [highlight, setHighlight] = useAtom(toggleHighlight);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2>Cryptocurrency Prices by Market Cap</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
            praesentium nihil fugiat blanditiis temporibus itaque ipsum veniam
            at quibusdam et?
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
          <Switch
            id="airplane-mode"
            checked={highlight}
            onCheckedChange={(data) => setHighlight(data)}
          />
        </div>
      </div>
      {highlight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[100px] gap-4">
          <div className="bg-red-300"></div>
          <div className="bg-green-300 col-start-1 row-start-2"></div>
          <div className="bg-red-300 row-span-2"></div>
          <div className="bg-red-300 row-span-2"></div>
        </div>
      )}
    </div>
  );
};

export default Highlights;
