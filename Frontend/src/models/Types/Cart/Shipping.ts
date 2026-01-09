export type ShippingMethod = {
        id: string,
        label: "Post NL" | "UPS" | "FedEx" | "DHL Express",
        logo: string,  
        taxes: number,
        service: string,
        deleveryTime: string,

}