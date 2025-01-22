import { useParams } from "react-router-dom"
import axiosApi from "../axiosApi"
import { useEffect, useState } from "react"

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
    color: string;
    size: string;
    stock: number
}
  
export const ViewProduct = () => {

    const params = useParams()
    const id = params.id
    
    const [productInfo, setProductInfo] = useState<Product|null>(null)
    const [totalStock, setTotalStock] = useState(0)
    const [quantity, setQuantity] = useState<number>(1)
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    
    
    useEffect (() => {
        getProduct()
    }, [selectedColor,selectedSize])
     const getProduct = () => {
      axiosApi.get (`/products/${id}`, {
        params:{
          color:selectedColor,
           size:selectedSize
        }})
      .then((response)=>{
        setProductInfo(response.data.product)
        console.log(response.data)
        setTotalStock(response.data.variant_stock?? response.data.total_stock)    
        console.log("variant stock",response.data.variant_stock) 
        console.log("total stock",response.data.total_stock)
      })
      .catch ((error)=>{
        console.log(error)
      })
    }

    const handleColorSelect = (color: string) => {
     selectedColor==color? setSelectedColor("") : setSelectedColor(color)
     setQuantity(1)
    }
  
    const handleSizeSelect = (size: string) => {
      selectedSize==size? setSelectedSize("") : setSelectedSize(size)
      setQuantity(1)
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
             <span className="text-2xl font-semibold text-gray-800">₱{productInfo?.price}</span>
            
            </div>
            <span className="text-2xl font-semibold text-gray-800">
              <div className="flex space-x-2 mb-3">
            {productInfo?.variants.map((variant) => (
                <span key={variant.color}>
                  <div 
                    onClick = {() => handleColorSelect(variant.color)}
                    className={`w-6 h-6 rounded-full cursor-pointer border ${variant.color === selectedColor ? "border-blue-500" : ""} `}
                    style={{backgroundColor: variant.color}}>   
                  </div>
                </span>
              ))}
              </div>
            </span>
            <span className=" font-semibold text-gray-800">
              <div className="flex space-x-2 mb-3">
            {productInfo?.variants.map((variant) => (
                <span key={variant.size}>
                  <div 
                    onClick = {() => handleSizeSelect(variant.size)}
                    className={` p-1 px-2 cursor-pointer border  ${variant.size === selectedSize ? "border-blue-500" : ""} `}>
                    {variant.size}
                  </div>
                </span>
              ))}
              </div>
            </span>
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
           <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4">
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
