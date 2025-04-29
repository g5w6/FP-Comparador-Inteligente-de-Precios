import Carousel from "./components/carousel";
import Products from "./components/sliderproducts";

export default function children() {
  return (
    <>
      {/* Carousel section */}
      <section>
        <Carousel
          text1="Fácil, Rápido y Cómodo"
          text2="Encuentra todo"
          text3="lo que necesitas"
          text4="Ahorra en grande"
        />
      </section>

      {/* Slider Products */}
      <div className="w-fit mt-17 ml-60">
        <h1
          id="mejores-ofertas"
          className="text-7xl underline decoration-red-600 font-bold"
        >
          Mejores Ofertas
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <Products />
      </div>

      {/* <section>
        <Bento />
      </section> */}
    </>
  );
}
