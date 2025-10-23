import type { osSizeDTO } from "../../../models/Types/sizeCalculator/DTO/Auth/osDTO"

export const getSizeFromLocalStorageOS = (): osSizeDTO => ({
    OSShoulderSize: localStorage.getItem("OSShoulderSize") ? Number(localStorage.getItem("OSShoulderSize")): null,
    OSChestSize: localStorage.getItem("OSChestSize") ? Number(localStorage.getItem("OSChestSize")): null,
    OSWaistSize: localStorage.getItem("OSWaistSize") ? Number(localStorage.getItem("OSWaistSize")): null,
})