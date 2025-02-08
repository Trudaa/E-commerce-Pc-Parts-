import { useEffect, useState } from "react";
import axiosApi from "../axiosApi"

type AddToCartModalProps = {
    productId: number | null
    setIsCartModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    isCartModalOpen: boolean
}

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

export const AddToCartModal = ({productId,setIsCartModalOpen,isCartModalOpen}:AddToCartModalProps) => {

 const [productInfo, setProductInfo] = useState<Product|null>(null);
    
 useEffect(() => {
     getProducts()
 }, [])

 const getProducts = () => {
    axiosApi.get(`/products/${productId}`)
    .then((response) => {
        setProductInfo(response.data.product)
     
    })
    .catch((error) => {
        console.log(error)
    })
 }

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 bg-white shadow-lg rounded-lg p-6 relative">
        <div className="text-green-500 font-medium mb-4 text-center">
          Product successfully added to your Shopping Cart
        </div>
        <div className="flex items-center">
          <img
            src={productInfo?.image}
            alt="Product"
            className="w-16 h-16 rounded mr-4"
          />
          <div>
            <div className="text-lg font-semibold">
           { productInfo?.name}
            </div>
            <div className="text-sm">Price: <span className="font-semibold">₱{productInfo?.price}</span></div>
            <div className="text-sm">Quantity: <span className="font-semibold">4</span></div>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              There are <span className="font-semibold">8 items</span> in your cart
            </div>
            <div className="text-lg font-semibold">
              Cart Total: <span className="text-lg font-bold">₱16,404.00</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button onClick ={() => setIsCartModalOpen(!isCartModalOpen)} className="px-4 py-2 bg-gray-200 rounded shadow">
              Continue Shopping
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded shadow">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
