import type { ShippingMethod } from "../Types/Cart/Shipping"

export const shippingMethods: ShippingMethod[] = [
    {
        id: "1",
        label: "Post NL",
        logo: `${import.meta.env.BASE_URL}logos/postnl.png`,
        taxes: 3.99,
        service: "Express Shipping",
        deleveryTime: "1-3"
   },
   {
        id: "2",
        label: "UPS",
        logo: `${import.meta.env.BASE_URL}logos/ups.png`,
        taxes: 2.99,
        service: "Standard Shipping",
        deleveryTime: "6-7"
  },
  {
        id: "3",
        label: "FedEx",
        logo: `${import.meta.env.BASE_URL}logos/fedex.png`,
        taxes: 3.59,
        service: "Express Shipping",
        deleveryTime: "1-3"
  },
  {
        id: "4",
        label: "DHL Express",
        logo: `${import.meta.env.BASE_URL}logos/dhl-1.svg`,
        taxes: 4.99,
        service: "Express Shipping",
        deleveryTime: "1-3"
  },
]