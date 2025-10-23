import type { TSizeFDTO } from "../../../models/Types/sizeCalculator/DTO/Auth/TSizeFDTO"

export const getSizeFromLocalStorageF = ():TSizeFDTO => ({
    TShoulderSizeF: localStorage.getItem("TShoulderSizeF") ? Number(localStorage.getItem("TShoulderSizeF")): null,
    TChestSizeF: localStorage.getItem("TChestSizeF") ? Number(localStorage.getItem("TChestSizeF")): null,
    TWaistSizeF: localStorage.getItem("TWaistSizeF") ? Number(localStorage.getItem("TWaistSizeF")): null,
})