import { useEffect, useState } from "react";
import axiosApi from "../axiosApi";
import { useStateContext } from "../context/ContextProvider";
import { SelectVariation } from "../utils/SelectVariation";
import Swal from "sweetalert2";
import debounce from "debounce";


type CartItem = {
    id: number
    product: Product
    quantity: number
    selected_variant : {
        id: number
        color: string,
        size: string
        price_override: number
        stock: number
      }
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
    id :number
    color: string;
    size: string;
    stock: number
    price_override: number
    }


export const CartPage = () => {

  const {user,getCartCount} = useStateContext()
  const id  = user?.id

  const [cartProducts, setCartProducts] = useState<CartItem[]>([])
  const [isVariantModalOpen, setIsVariantModalOpen] = useState<number | null>(null)
  const [cartProductId, setCartProductId] = useState<number | null>(null)
  const [quantityMap, setQuantityMap] = useState<{ [key: number]: number }>({});
  const [cartTotal, setCartTotal] = useState<number>(0)
    //variable use in SelectVariation
  const [productId, setProductId] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [variantId, setVariantId] = useState<number | null>(null)
  const [totalStock, setTotalStock] = useState<number>(0)

  useEffect(() => {
    getCartProducts()
  }, [])
  const getCartProducts = () => {
      axiosApi.get(`/carts/${id}`)
    .then((response) => {
      setCartProducts(response.data.cartItems);
     console.log("cartItems",response.data.cartItems)
      const initialQuantities: { [key: number]: number } = {};
      response.data.cartItems.forEach((item: CartItem) => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantityMap(initialQuantities);
      getCartCount();
    })
    .catch((error) => {
        console.log(error)
    })
 } 
  
 const updateVariant = () => {
  axiosApi.post("/carts", {
    productId: productId,
    variantId: variantId,
    userId : id,
    cartProductId :cartProductId,
    variantStock: totalStock
  })
  .then((response) => {
    console.log(response)
    setIsVariantModalOpen(null)
    getCartProducts()
  })
  .catch((error) => {
    console.log(error)
  })
}  
  

 const handleQuantityChange =  ( ProductId:number, quantity: number,  cartProductId: number, index: number) => {
  setQuantityMap((prev) => ({ ...prev, [cartProductId]: quantity }));
  axiosApi.post("/carts", {
    quantity: quantity,
    userId : id,
    productId: ProductId,
    cartProductId :cartProductId,
    variantStock: cartProducts[index].selected_variant.stock
  })
  .then((response) => {
     console.log(response)
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: error.response.data.message,
      showConfirmButton: false,
      timer: 1500
    })
  })
}
 
const handleDelete = (id: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      axiosApi.delete(`/carts/${id}`)
        .then((response) => {
          console.log(response);
          getCartProducts();
          Swal.fire(
            'Deleted!',
            'Your item has been deleted.',
            'success'
          );
        })
        .catch((error) => {
          console.log(error);
          Swal.fire(
            'Error!',
            'There was an issue deleting the item.',
            'error'
          );
        });
    }
  });
}
  const openVariantModal = (ProductId:number ,index: number, cartId:number) => {
    setIsVariantModalOpen(prevIndex => (prevIndex === index ? null : index))
    setProductId(ProductId)
    setCartProductId(cartId)
  }
   
  useEffect(() => {
    calculateCartTotal();
  },[quantityMap] )

  const calculateCartTotal = () => {
    let total = 0;
    cartProducts.forEach((item) => {
      let itemPrice =  item.selected_variant.price_override === null? item.product.price : item.selected_variant.price_override;
      total += quantityMap[item.id] * itemPrice;
    });
    setCartTotal(total);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-2">
  {/* <!-- Left Side --> */}
  <div className="md:w-3/4 flex flex-col bg-white p-4 rounded-lg shadow-md">
    <header className="border border-gray-300 rounded-md shadow-sm mb-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-center text-sm text-gray-600 w-2/5">
              Product
            </th>
            <th className="py-2 text-center text-sm text-gray-600 w-1/6">
              Quantity
            </th>
            <th className="py-2 text-center text-sm text-gray-600 w-1/6">
              Price
            </th>
            <th className="py-2 text-center text-sm text-gray-600 w-1/6">
              Cart Total
            </th>
            <th className="py-2 text-center text-sm text-gray-600 w-1/6">
              Action
            </th>
          </tr>
        </thead>
      </table>
    </header>
    {cartProducts.map((item: CartItem, index) => {
      let itemPrice =item.selected_variant.price_override === null? item.product.price : item.selected_variant.price_override;
      let itemTotal = itemPrice * quantityMap[item.id];
      return (
        <div key={item.product.id} className="border-b border-gray-300">
          <div className="pl-3 flex items-center py-2 w-full">
             {/* Product Area  */}
              <div className="flex items-center w-5/12 p-3 ">
                  <img
                    className="w-20 h-20 object-cover"
                    src={item.product.image}
                    alt={item.product.name}
                  />
                  <div className="ml-4">{item.product.name}</div>
                  {/* Selected Variation */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        openVariantModal(item.product.id, index, item.id);
                        setSelectedColor(item.selected_variant.color);
                        setSelectedSize(item.selected_variant.size);
                      }}
                      className="text-gray-500 text-sm ml-4"
                    >
                    <span>Variation: {item.selected_variant.color},
                    {item.selected_variant.size}</span> 
                    (stock:{" "} {item.selected_variant.stock})
                    </button>
                  
                  {/* Variant Modal */}
                    {isVariantModalOpen === index && (
                      <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg p-3 rounded-lg z-50">
                        <div>
                          <SelectVariation
                            setTotalStock={setTotalStock}
                            setVariantId={setVariantId}
                            setSelectedColor={setSelectedColor}
                            setSelectedSize={setSelectedSize}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            productId={productId}
                          />
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
                            disabled={
                              !selectedColor || !selectedSize || totalStock === 0
                            }
                            onClick={updateVariant}
                          >
                            Confirm
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                            onClick={() => setIsVariantModalOpen(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
           {/* Quantity to Action Area */}
               {/* Quantity  */}
          <div className="  flex justify-between items-center p-2 w-7/12 pd-3 pl-4">
            <div className="text-center text-sm text-gray-600 w-1/6 flex">
              <button
                className="px-2 bg-gray-300"
                onClick={() =>
                  handleQuantityChange(
                    item.product.id,
                    quantityMap[item.id] - 1,
                    item.id,
                    index
                  )
                }
                disabled={quantityMap[item.id] === 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantityMap[item.id] ?? item.quantity}
                onChange={(e) =>
                  handleQuantityChange(
                    item.product.id,
                    Number(e.target.value),
                    item.id,
                    index
                  )
                }
                className="w-12 text-center border"
              />
              <button
                className="px-2 bg-gray-300"
                onClick={() =>
                  handleQuantityChange(
                    item.product.id,
                    quantityMap[item.id] + 1,
                    item.id,
                    index
                  )
                }
                disabled={quantityMap[item.id] >= item.selected_variant.stock}
              >
                +
              </button>
            </div>
            <div className="py-2 text-center text-sm text-gray-600 w-1/6">₱{itemPrice}</div>
            <div className="py-2 text-center text-sm text-gray-600 w-1/6">
              ₱{itemTotal.toFixed(2)}
            </div>
            <button
              className="py-2 text-center text-sm  w-1/6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      );
    })}
  </div>

  {/* <!-- Right Side --> */}
  <div className="md:w-1/4 bg-white p-4 ml-4 rounded-lg shadow-md">
    <div>
      <div className="font-semibold text-lg text-gray-700">Cart Total</div>
      <div className="text-gray-700 mt-2">₱{cartTotal.toFixed(2)}</div>
    </div>
    <div className="mt-4">
      <label className="block text-gray-700">Add a note to your order</label>
      <textarea className="mt-2 w-full border rounded p-2"></textarea>
    </div>
    <div className="mt-4">
      <button className="w-full bg-yellow-500 text-white font-bold py-2 rounded shadow hover:bg-yellow-600">
        Proceed to Checkout
      </button>
    </div>
  </div>
</div>
  )

}
