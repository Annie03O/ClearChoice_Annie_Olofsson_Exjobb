import { useEffect, useState } from "react";
import { readCategory } from "../../../functions/helpers/readCategory";
import type { Saved } from "../../../models/Types/sizeCalculator/Saved";
import { SizeCard } from "../../../components/SizeCalculator/Cards/SizesCard";


export const Messurements = () => {
      const [saved, setSaved] = useState<Saved>({ M: null, F: null, OS: null });

  // Läs från localStorage vid mount
  useEffect(() => {
    const M = readCategory({
      shoulderSize: "TShoulderSizeM",
      chestSize: "TChestSizeM",
      waistSize: "TWaistSizeM",
    });
    const F = readCategory({
      shoulderSize: "TShoulderSizeF",
      chestSize: "TChestSizeF",
      waistSize: "TWaistSizeF",
    });
    const OS = readCategory({
      shoulderSize: "OSShoulderSize",
      chestSize: "OSChestSize",
      waistSize: "OSWaistSize",
    });
    setSaved({ M, F, OS });
  }, []);

  const reload = () => {
    const M = readCategory({
      shoulderSize: "TShoulderSizeM",
      chestSize: "TChestSizeM",
      waistSize: "TWaistSizeM",
    });
    const F = readCategory({
      shoulderSize: "TShoulderSizeF",
      chestSize: "TChestSizeF",
      waistSize: "TWaistSizeF",
    });
    const OS = readCategory({
      shoulderSize: "OSShoulderSize",
      chestSize: "OSChestSize",
      waistSize: "OSWaistSize",
    });
    setSaved({ M, F, OS });
  };

  const hasAny = saved.M || saved.F || saved.OS;

  return (
    <section>
      <header>
        <h2>Sparade mått</h2>
        <button onClick={reload}>Uppdatera</button>
      </header>

      {!hasAny ? (
        <p>Inga sparade mått hittades i din webbläsare.</p>
      ) : (
        <section>
          {saved.M && <SizeCard title="Herr T-shirt" size={saved.M} />}
          {saved.F && <SizeCard title="Dam T-shirt" size={saved.F} />}
          {saved.OS && <SizeCard title="Oversized T-shirt" size={saved.OS} />}
        </section>
      )}
    </section>
  );
}