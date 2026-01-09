import type { SizeDTO } from "../../../models/Types/sizeCalculator/DTO/SizeDTO"

export const getSizeFromLocalStorage = (): SizeDTO => ({
    TShoulderSizeM: localStorage.getItem("TShoulderSizeM") ? Number(localStorage.getItem("TShoulderSizeM")): null,
    TChestSizeM: localStorage.getItem("TChestSizeM") ? Number(localStorage.getItem("TChestSizeM")): null,
    TWaistSizeM: localStorage.getItem("TWaistSizeM") ? Number(localStorage.getItem("TWaistSizeM")): null,
    TShoulderSizeF: localStorage.getItem("TShoulderSizeF") ? Number(localStorage.getItem("TShoulderSizeF")): null,
    TChestSizeF: localStorage.getItem("TChestSizeF") ? Number(localStorage.getItem("TChestSizeF")): null,
    TWaistSizeF: localStorage.getItem("TWaistSizeF") ? Number(localStorage.getItem("TWaistSizeF")): null,
    OSShoulderSize: localStorage.getItem("OSShoulderSize") ? Number(localStorage.getItem("OSShoulderSize")): null,
    OSChestSize: localStorage.getItem("OSChestSizeM") ? Number(localStorage.getItem("OSChestSize")): null,
    OSWaistSize: localStorage.getItem("OSWaistSizeM") ? Number(localStorage.getItem("OSWaistSize")): null,
})