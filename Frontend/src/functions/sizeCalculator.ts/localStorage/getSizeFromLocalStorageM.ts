import type { TSizeMDTO } from "../../../models/Types/sizeCalculator/DTO/Auth/TSizeMDTO"

export const getSizeFromLocalStorageM = (): TSizeMDTO => ({
    TShoulderSizeM: localStorage.getItem("TShoulderSizeM") ? Number(localStorage.getItem("TShoulderSizeM")): null,
    TChestSizeM: localStorage.getItem("TChestSizeM") ? Number(localStorage.getItem("TChestSizeM")): null,
    TWaistSizeM: localStorage.getItem("TWaistSizeM") ? Number(localStorage.getItem("TWaistSizeM")): null
})