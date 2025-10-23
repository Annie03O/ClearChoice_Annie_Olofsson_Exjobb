export type Product = {
    id: string;
    label: string;
    fandom: string;
    imgUrl: string;
    price: number;
    path: string;
    description: string;
    fit: string;
    washing: {
        temp: number;
        similarColors: boolean;
        canBleach: boolean;
        dry: string;
        iron: string;
        dryClean: boolean;
    }, 
}
