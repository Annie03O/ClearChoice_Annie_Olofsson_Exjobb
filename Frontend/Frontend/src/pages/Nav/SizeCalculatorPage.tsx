import { CalcSizeProvider } from "../../components/SizeCalculator/Providers/Calc/CalcSizeProvider";
import { CalcSize } from "../../components/SizeCalculator/Calc/CalcSize";
import { tshirtSizesF } from "../../models/objects/sizeCalculator/tshirtSizesF";
import { tshirtSizesM } from "../../models/objects/sizeCalculator/tshirtsSizesM";
import { oversizedFit } from "../../models/objects/sizeCalculator/oversizedFit";

export const SizeCalculatorPage = () => {
    return (
        <section className="flex justify-center">
          <section className="bg-white text-[#010057] w-[80%] min-h-[calc(100vh-160px)]">
            <section className="text-center">
            <h1 className="text-[3em] font-bold mb-4">Size Calculator</h1>
            <p className="text-lg mb-8">Find your perfect fit with our Size Calculator! Whether you're looking for T-Shirts for.</p> 
          </section>
          <section className="flex justify-center items-center gap-4 max-sm:flex-col w-full">
              <CalcSizeProvider>
                  <CalcSize id="F-size" model={tshirtSizesF} title="T-Shirts för damer"/>
                  <CalcSize id="M-size" model={tshirtSizesM} title="T-Shirts för män"/>
                  <CalcSize id="OS-size" model={oversizedFit} title="Hoodies/Sweatshirts"/>
              </CalcSizeProvider>
          </section>
          </section>
        </section>
    )

}
