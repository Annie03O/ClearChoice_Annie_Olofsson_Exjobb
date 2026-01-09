import type { Messurement } from "../../models/Types/sizeCalculator/Messurements";

 (iso: string) => 
    new Date(iso).toLocaleDateString("sv-SE", {year: "numeric", month: "short", day: "numeric"});


export const tFilterF = (tshirtSizesF: Messurement[], nq: string, norm: (s: string) => string): Messurement[] => {
    const nqNorm = norm(nq);

    const allMessurements = tshirtSizesF.filter((t) => 
        [t.size, t.shoulders, t.minChest, t.maxChest, t.minWaist, t.maxWaist ? "": "" ].some((v) => norm(String(v)).includes(nqNorm))
    )

    return allMessurements;
    
}