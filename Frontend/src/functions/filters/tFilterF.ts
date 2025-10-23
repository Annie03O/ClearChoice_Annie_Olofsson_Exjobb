import { norm } from "../norm";
import type { Messurements } from "../../models/Types/sizeCalculator/Messurements";
import { tshirtSizesF } from "../../models/objects/sizeCalculator/tshirtSizesF";
import { t } from "react-router/dist/development/index-react-server-client-DKvU8YRr";

const fmt = (iso: string) => 
    new Date(iso).toLocaleDateString("sv-SE", {year: "numeric", month: "short", day: "numeric"});


export const tFilterF = (q: string): Messurements => {
    const nq = norm(q);

    const allMessurements = tshirtSizesF.filter((t) => 
        [t.size, t.shoulders, t.minChest, t.maxChest, t.minWaist, t.maxWaist ? "" ].some((v) => norm(v).includes(nq))
    )

    return allMessurements;
    
}