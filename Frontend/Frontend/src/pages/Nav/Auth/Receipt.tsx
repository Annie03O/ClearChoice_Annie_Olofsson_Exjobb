import { formatMoney } from "../../../functions/Order/formatMoney";
import { titleCase } from "../../../functions/titleCase";
import type { OrderResponse } from "../../../models/Types/Order/OrderResponse"

type ReceiptProps = {
    order: OrderResponse;
    orderNumber: string;
    fullName: string;
}
export const Receipt = ({order, orderNumber, fullName}: ReceiptProps) => {
    return (
              <section className="md:p-4 flex  w-full justify-center md:w-[90%]">
                <section className="w-full  border p-4">
                  <header className="border-b pb-3 text-[clamp(18px,1.6vw,30px)]">
                    <h1 className="text-[clamp(20px,2vw,65px)]">Receipt</h1>
                    <p className="mt-1">Order ID: {orderNumber}</p>
                    <p>
                      Status:   {order.status} / {order.paymentStatus}
                    </p>
                    <p>Payment: {order.paymentMethod}</p>
                  </header>
        
                  <section className="mt-4 flex w-full flex-col  md:flex-row gap-6 text-[clamp(15px,1.6vw,30px)]">
                    <section className="w-full md:w-1/2 md:border md:p-3 ">
                      <h2 className="text-[clamp(25px,2vw,40px)]">Shipping details</h2>
                      <p className="mt-2">{fullName}</p>
                      <p>{order.address.address}</p>
                      {order.address.secondAddress ? <p>{order.address.secondAddress}</p> : null}
                      <p>
                        {order.address.zip} {order.address.city}
                      </p>
                      <p>{order.address.country}</p>
                      <p className="mt-2">Email: {order.email}</p>
                    </section>
        
                    <section className="md:w-1/2 md:border md:p-3">
                      <h2 className="text-[clamp(25px,2vw,40px)]">Summary</h2>
                      <section className="mt-2 flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatMoney(order.subtotal, order.currency)}</span>
                      </section>
                      <section className="flex justify-between ">
                        <span>Shipping</span>
                        <span>{formatMoney(order.shippingFee, order.currency)}</span>
                      </section>
                      <section className="border-t mt-2 pt-2 flex md:flex-row justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatMoney(order.total, order.currency)}</span>
                      </section>
                    </section>
                  </section>
        
                  <section className="mt-4 md:border md:p-3 text-[clamp(18px,1.6vw,25px)]  w-full">
                    <h2 className="text-[clamp(18px,1.6vw,30px)]">Items</h2>
                    <ul className="mt-2 flex flex-col gap-2 justify-center  w-full" >
                      {order.items.map((it, idx) => (
                        <li key={`${it.productId}-${idx}`} className=" border-t  w-full p-1 flex flex-row justify-between w-fit">
                          <section>
                            <section className="font-semibold">{it.productNameSnapshot}</section>
                            <section className="flex">
                              <span className="flex whitespace-nowrap">Qty: {it.qty}</span>
                              <span className="flex whitespace-nowrap">{it.color ? ` • Color: ${titleCase(it.color)}` : ""}</span>
                              <span className="flex whitespace-nowrap">{it.size ? ` • Size: ${titleCase(it.size)}` : ""}</span>
                            </section>
                          </section>
        
                          <section className="text-right">
                            <section className="font-semibold">
                              {formatMoney(it.unitPriceSnapshot * it.qty, order.currency)}
                            </section>
                          </section>
                        </li>
                      ))}
                    </ul>
                  </section>
                </section>
              </section>
        
    )
}