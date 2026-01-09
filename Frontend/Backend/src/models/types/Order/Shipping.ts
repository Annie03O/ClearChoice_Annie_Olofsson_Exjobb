export type ShippingMethod = {
        id: number,
        label: "Post NL" | "UPS" | "FedEx" | "DHL Express",
        logo: string,  
        taxes: number,
        service: string,
        deleveryTime: string,

}