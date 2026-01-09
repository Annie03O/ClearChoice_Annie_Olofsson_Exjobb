
export const SizeInfo = ({ title, result, onClose }: { title: string; result: string; onClose: () => void }) => {
  return (
    <section className="bg-white rounded p-4">
      <p className="text-black text-xl">
        Din storlek för "{title}" är <span className="font-semibold">{result || "ingen match"}</span>
      </p>

      <button type="button" className="underline mt-4 text-black" onClick={onClose}>
        Räkna igen
      </button>
    </section>
  );
};
