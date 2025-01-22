import { useEffect, useState } from "react";
import axiosApi from "../axiosApi";
import { SearchFilter } from "../utils/SearchFilter";
import { ProductTable } from "../utils/ProductTable";
import { useOutletContext } from "react-router-dom";
import { AddToCartModal } from "./AddToCartModal";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  color: string;
  size: string;
  variants: Variant[];
};

type Variant = {
  id: number;
  color: string;
  size: string;
  stock: number;
};

type PriceRange = {
  min: number | null;
  max: number | null;
};

type ContextType = {
  handleSearchSubmit: (e: any) => void;
  search: string | null
  triggerSearch: boolean
}

export const ComponentPage = () => {

  const {search,triggerSearch} = useOutletContext<ContextType>()


  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  //Side Filter
  const [priceRange, setPriceRange] = useState<PriceRange>({min:null, max:null});
  const [brands, setBrands] = useState<string[]>([]);
  const [availability, setAvailability] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  //Top Filter
  const [filterBy, setFilterBy] = useState<string>("BestSelling");
  //Add to cart Modal
  const [productId, setProductId] = useState<number | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);


  const getProducts = async() => {
    await axiosApi
      .get(`/products`, {
        params: {
          page: currentPage,
          per_page: 16,
          price_min: priceRange.min,
          price_max: priceRange.max,
          availability: availability? true : undefined,
          brands:brands, 
          colors: colors,
          sizes: sizes,
          search:search,
          filterBy: filterBy,
        },
      })
      .then((response) => {
        setProducts(response.data.data)
        setTotalPages(response.data.last_page)
        setTotalResults(response.data.total)    
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const handleApplyFilters = () => {
    setCurrentPage(1)
    getProducts()
  };


  useEffect(() => {
    getProducts();
  }, [currentPage,triggerSearch, filterBy]);

  return (
    <div className="flex flex-col p-1 bg-white min-h-screen px-1">
     
       <div className="text-2xl font-bold mb-4 text-gray-600 pl-2">Component</div>
     <div className="flex justify-between items-center mb-4 p-2 px-4 shadow-md">
    
      <div className="text-lg font-semibold bg-gray-50">
        <span className="text-gray-600">Products Found:</span> <span className="text-gray-800 italic">{totalResults}</span>
      </div>
      <div className="flex items-center">
       
        <select
          className="px-4 py-2 rounded-md border border-gray-300"
          value={filterBy}
          onChange={(e) => { setFilterBy(e.target.value); setCurrentPage(1); }}
        >
          <option value="BestSelling">Best Selling</option>
          <option value="HighToLow">Price: High to Low</option>
          <option value="LowToHigh">Price: Low to High</option>
          <option value="NewToOld">Date: New to Old</option>
          <option value="OldToNew">Date: Old to New</option>
        </select>
      </div>
    </div>
    <div className="flex flex-col md:flex-row ">
      <div className="pl-1 md:w-25">
        <SearchFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setBrands={setBrands}
          availability={availability}
          setAvailability={setAvailability}
          colors={colors}
          setColors={setColors}
          sizes={sizes}
          setSizes={setSizes}
          handleApplyFilters={handleApplyFilters}
        />
      </div>

      <div className="w-full md:w-75 flex-grow">
        <ProductTable products={products}  setProductId={setProductId} isCartModalOpen={isCartModalOpen} setIsCartModalOpen={setIsCartModalOpen}/>
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-blue-400 rounded-l hover:bg-blue-600 disabled:bg-gray-200"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className="px-4 py-2 bg-blue-400 rounded-r hover:bg-blue-600 disabled:bg-gray-200"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    {isCartModalOpen && <AddToCartModal productId={productId} setIsCartModalOpen={setIsCartModalOpen} isCartModalOpen={isCartModalOpen} />}
  </div>
  );
};