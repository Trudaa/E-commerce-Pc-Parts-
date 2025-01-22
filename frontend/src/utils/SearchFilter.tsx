

type Props = {
  priceRange:{min:null|number, max:null|number }
  setPriceRange: (range: {min:null|number, max:null|number }) => void;
  setBrands: React.Dispatch<React.SetStateAction<string[]>>;
  availability: boolean;
  setAvailability: (availability: boolean) => void;
  colors: string[];
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
  sizes: string[];
  setSizes: React.Dispatch<React.SetStateAction<string[]>>
  handleApplyFilters?: () => void;
}

export const SearchFilter = ({
  priceRange,
  setPriceRange ,
  setBrands,
  availability,
  setAvailability,
  colors,
  setColors,
  sizes,
  setSizes,
  handleApplyFilters,

}: Props) => {
  const brand = ["MSI", "ASUS", "GIGABYTE"];
  const color = ["black", "white", "pink"];
   const size = ["1TB", "128GB", "256GB", "500GB", "512GB", "650W"];

  const handleBrandChange = (brand: string) => {
    setBrands((prevBrand: string[]) => {
      const isSelected = prevBrand.includes(brand);
      if (isSelected) {
        return prevBrand.filter((b) => b !== brand);
      } else {
        return [...prevBrand, brand];
      }
    })
  }


  const handleColorChange = (color: string) => {
    setColors((prevColor: string[]) => {
      const isSelected = prevColor.includes(color);
      if (isSelected) {
        return prevColor.filter((c) => c !== color);
      } else {
        return [...prevColor, color];
      }
    })
  }

  const handleSizeChange = (size: string) => {
    setSizes((prevSize: string[]) => {
      const isSelected = prevSize.includes(size);
      if (isSelected) {
        return prevSize.filter((c) => c !== size);
      } else {
        return [...prevSize, size];
      }
    })
  }

  return (
    <div className="w-65 p-6 border rounded-lg bg-white shadow-md">
      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Price (₱) </h3> 
       
        <div className="flex items-center gap-3">
          <input
            type="number"
            className="w-24 border p-2 text-sm rounded"
            value={priceRange.min?? ''}
            placeholder="Min"
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value == ''? null : Number(e.target.value) })}
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            className="w-24 border p-2 text-sm rounded"
            value={priceRange.max?? ''}
            placeholder="Max"
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value == ''? null : Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Availability</h3>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="mr-2 rounded"
            checked={availability}
            onChange={() => setAvailability(!availability)}
          />
          In Stock
        </label>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Brand</h3>
        <div className="flex flex-col gap-2 text-sm">
          {brand.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded"
                onChange={() => handleBrandChange(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Color</h3>
        <div className="flex gap-3">
          {color.map((col) => (
            <div
              key={col}
              className={`w-6 h-6 rounded-full cursor-pointer border ${
                colors.includes(col) ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: col }}
              onClick={() => handleColorChange(col)}
            ></div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-700 mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {size.map((z) => (
            <button
              key={z}
              className={`border p-2 rounded ${
                sizes.includes(z) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
              } hover:bg-blue-200`}
              onClick={()=>handleSizeChange(z)}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-semibold"
      >
        Apply Filter
      </button>
    </div>
  );
};
