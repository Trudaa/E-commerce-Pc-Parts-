import axiosApi from "../axiosApi"
import {  useState } from "react"
import { useStateContext } from "../context/ContextProvider";
import { SelectVariation } from "../utils/SelectVariation";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    rating: number;
    color:string;
    size: string;
    variants: Variant[]
  };

type Variant ={
    id: number
    color: string;
    size: string;
    stock: number
    price_override: number
}

  
export const ViewProduct = () => {
   
  const {user,getCartCount} = useStateContext()
   const userId =  user?.id

   const params = useParams()
   const productId = Number(params.id)
  
    const [productInfo, setProductInfo] = useState<Product|null>(null)
    const [totalStock, setTotalStock] = useState(0)
    const [quantity, setQuantity] = useState<number>(1)
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [variantId, setVariantId] = useState<number | null>(null)
    const [productPrice,setProductPrice] = useState<number|null>(null)
    
    const handleAddToCart = () => {
      if(!user?.id){
        Swal.fire({
          icon: 'error',
          title: 'Please login to add to cart',
          showConfirmButton: false,
          timer: 1500
        })
        return
      }
      axiosApi.post("/carts", {
        productId: productInfo?.id,
        quantity: quantity,
        variantId: variantId,
        userId : userId,
        variantStock: totalStock
      })
      .then((response) => {
        console.log(response)
        getCartCount()
        Swal.fire({
          icon: 'success',
          title: 'Product added to cart',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500
        })
      })
    }

  return (
    <div className=" flex flex-col md:flex-row min-h-screen pd-1 ">
      {/* Left Side */}
        <div className="  md:w-4/5 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 ">
          <div className="lg:col-span-2">
          <img
            src={productInfo?.image}
            alt="Product Image"
            className="rounded-lg w-full h-96 object-cover"
            />
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-3">{productInfo?.name}</h1>
            <div className="text-gray-600 mb-3">{productInfo?.brand.toUpperCase()}</div>
            <div className="flex items-center mb-4">
             <span className="text-2xl font-semibold text-gray-800">₱{productPrice === null? productInfo?.price : productPrice}</span>
            </div>
            <SelectVariation 
              setProductInfo={setProductInfo}
              setTotalStock={setTotalStock}
              setVariantId={setVariantId}
              setProductPrice={setProductPrice}
              setQuantity={setQuantity}
              setSelectedColor={setSelectedColor}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              productId={productId}
            />
            {/* Quantity */}
          <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">Quantity:</label>
              <div className="relative flex items-center border border-gray-300 rounded-md px-2 py-1 w-32">
                  <input
                    type="number"
                    className=" border-none focus:outline-none w-full"
                    value={quantity>totalStock?totalStock:quantity}
                    placeholder={quantity.toString()}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <div className="absolute right-0 flex items-center space-x-1 pr-2">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => setQuantity (quantity - 1)}
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity === totalStock}
                    >
                      +
                    </button>
                  </div>
              </div>
              <div className="text-gray-600 ml-2"> {totalStock} stock available</div>
            </div>
            {/* Add to Cart Button */}
           <button
             onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize || totalStock === 0}
             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 disabled:bg-blue-300 ">
            Add to Cart
           </button>
          </div>
          </div>
        </div>
      {/* Right Side */}
        <div className="0 md:w-1/5">
          <div className="border  rounded shadow-sm">
            <h2 className="text-lg font-semibold p-2 ">Delivery Options</h2>
            <hr className="border-b "/>
             <div className="p-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">Nationwide Delivery</span>
                </li>
                <li>
                  <span className="font-semibold">Easy2get Delivery</span> <br />
                  <span className="text-sm text-gray-600">- As fast as 2 hours</span>
                </li>
                <li>
                  <span className="font-semibold">Express Delivery</span> <br />
                  <span className="text-sm text-gray-600">- Delivery within 4 hours</span>
                </li>
                <li>
                  <span className="font-semibold">Same Day Delivery</span> <br />
                  <span className="text-sm text-gray-600">- Order between 12:00AM to 12:00NN</span>
                </li>
                <li>
                  <span className="font-semibold">Standard Delivery</span>
                </li>
              </ul>
             </div>
          </div>
        </div>
    </div>
  )
}
