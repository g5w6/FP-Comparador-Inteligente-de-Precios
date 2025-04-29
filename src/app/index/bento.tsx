"use client";

const Bento = () => {
  return (
    <div className="mt-17 ml-60">
      <h1
        id="mejores-ofertas"
        className="text-7xl underline decoration-red-600 font-bold"
      >
        Categorias mas populares
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-3 grid-rows-6 gap-4 mt-8">
        <div className="row-span-4 bg-amber-400 rounded-xl overflow-hidden">
          <a href="#">Frutas y verduras</a>
        </div>
        <div className="col-span-2 row-span-2 col-start-1 row-start-5 bg-amber-800 rounded-xl">
          2
        </div>
        <div className="col-span-2 row-span-2 col-start-2 row-start-1 bg-amber-950 rounded-xl">
          3
        </div>
        <div className="row-span-2 col-start-2 row-start-3 bg-amber-500 rounded-xl">
          4
        </div>
        <div className="row-span-2 col-start-3 row-start-3 bg-amber-300 rounded-xl">
          5
        </div>
        <div className="row-span-2 col-start-3 row-start-5 bg-amber-200 rounded-xl">
          6
        </div>
      </div>
    </div>
  );
};
export default Bento;
