import type { TSizeFDTO } from "./Auth/TSizeFDTO";
import type { TSizeMDTO } from "./Auth/TSizeMDTO";
import type  {osDTO} from "./Auth/osDTO"

export type SavedDTO = {
    WS: TSizeFDTO | null;
    MS: TSizeMDTO | null;
    OS: osDTO| null;
}


