import { useEffect, useState } from "react";
import axiosApi from "../axiosApi";
import { useStateContext } from "../context/ContextProvider";
import { Navigate } from "react-router-dom";


type CartItem = {
    product: Product
    quantity: number
}
type Product = {
      id:number,
      name: string,
      brand: string,
      price: number,
      image: string,
      rating: number,
      variants: Variant[]
    }
type Variant = {
        id: number
        color: string
        size: string
        stock: number
    }

// type Cart = {
//         id: number
//         product_id: number
//         user_id:number
//         total: number
//         quantity: number
//     }


export const CartPage = () => {

    const {user} = useStateContext()
  
    if(!user) {
        return <Navigate to='/' />
    }

    const id  = user.id

const [cartProducts, setCartProducts] = useState<CartItem[]>([])
const [cartTotal, setCartTotal] = useState(0)

useEffect(() => {
    getProductId()
    
}, [])
const getProductId = () => {
      axiosApi.get(`/carts/${id}`)
    .then((response) => {
        setCartProducts(response.data.cartItems)
        setCartTotal(response.data.cartTotal)
      
    })
    .catch((error) => {
        console.log(error)
    })
}

 



console.log(cartTotal)

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4">
      {/* <!-- Left Side -->   */}
        <div className="md:w-3/4 flex flex-col bg-white p-4 rounded-lg shadow-md">
            <header className="border border-gray-300 rounded-md shadow-sm mb-4">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 text-left pl-4 text-sm text-gray-600 w-1/2">Product</th>
                            <th className="py-2 text-left text-sm text-gray-600 w-1/6">Price</th>
                            <th className="py-2 text-left text-sm text-gray-600 w-1/6">Quantity</th>
                            <th className="py-2 text-left text-sm text-gray-600 w-1/6">Cart Total</th>
                        </tr>
                    </thead>
                </table>
            </header>
           {cartProducts.map((item: CartItem)=> (       
               <div>
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                <div className="pl-4 text-gray-700 w-1/6">
                     <img
                    src="https://placehold.co/200x200"
                    alt={item.product.name}
                    
                    />
                </div>
                    <div className="pl-4 text-gray-700 w-1/2">{item.product.name}</div>
                    <div className="text-gray-700 w-1/6">₱{item.product.price}</div>    
                    <div className="text-gray-700 w-1/6 text-center">{item.quantity}</div>
                    <div className="text-gray-700 w-1/6 text-right">₱{(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
               </div>
           ))}
          
            {/* <div className="flex justify-between items-center py-2 border-b border-gray-300">
            
                <div className="pl-4 text-gray-700 w-1/2">InPlay Meteor 03 Mid Tower</div>
                <div className="text-gray-700 w-1/6">₱1,115.00</div>
                <div className="text-gray-700 w-1/6 text-center">1</div>
                <div className="text-gray-700 w-1/6 text-right">₱1,115.00</div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-300">
                <div className="pl-4 text-gray-700 w-1/2">Gigabyte Rx 6600 Eagle</div>
                <div className="text-gray-700 w-1/6">₱13,850.00</div>
                <div className="text-gray-700 w-1/6 text-center">1</div>
                <div className="text-gray-700 w-1/6 text-right">₱13,850.00</div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-300">
                <div className="pl-4 text-gray-700 w-1/2">Team Elite Vulcan TUF 16GB</div>
                <div className="text-gray-700 w-1/6">₱1,905.00</div>
                <div className="text-gray-700 w-1/6 text-center">1</div>
                <div className="text-gray-700 w-1/6 text-right">₱1,905.00</div>
            </div> */}
        </div>

        {/* <!-- Right Side --> */}
        <div className="md:w-1/4 bg-white p-4 ml-4 rounded-lg shadow-md">
            <div>
                <div className="font-semibold text-lg text-gray-700">Cart Total</div>
                <div className="text-gray-700 mt-2">{(cartTotal).toFixed(2)}</div>
            </div>
            <div className="mt-4">
                <label className="block text-gray-700">Add a note to your order</label>
                <textarea className="mt-2 w-full border rounded p-2" rows="4"></textarea>
            </div>
            <div className="mt-4">
                <button className="w-full bg-yellow-500 text-white font-bold py-2 rounded shadow hover:bg-yellow-600">Proceed to Checkout</button>
            </div>
        </div>
    </div>
  )
}
