
import { useEffect, useState } from "react";
import axiosApi from "../axiosApi";

type Import = {
     setProductInfo?: React.Dispatch<React.SetStateAction<Product | null>>
     setTotalStock : React.Dispatch<React.SetStateAction<number>>
     setVariantId : React.Dispatch<React.SetStateAction<number | null>>
     setProductPrice? : React.Dispatch<React.SetStateAction<number | null>>
     setQuantity? : React.Dispatch<React.SetStateAction<number>>
     setSelectedColor : React.Dispatch<React.SetStateAction<string>>
     setSelectedSize : React.Dispatch<React.SetStateAction<string>>
     selectedColor: string
     selectedSize: string
     productId?: number | null
}
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
  id :number
  color: string;
  size: string;
  stock: number
  price_override: number
}

type sameVariant = {
  id: number;
  color: string
  totalstock: number
  size: string
  price_override: number
}
export const SelectVariation = ({setProductInfo,setTotalStock,setVariantId,setProductPrice,setQuantity,setSelectedColor, setSelectedSize,selectedColor,selectedSize,productId}:Import) => {
  
  const [sameVariant, setSameVariant] = useState<sameVariant[]>([]);
 
  const [totalstockHolder, setTotalStockHolder] = useState(0);

  useEffect (() => {
    getProduct()
}, [productId])

 const getProduct = async() => {
   await axiosApi.get (`/products/${productId}`,{
    params:{
      color:selectedColor,
       size:selectedSize
    }})
  .then((response)=>{
    const product = response.data.product  
    setProductInfo?.(product)
    const variantMap = new Map() //create map
    product.variants.map((variant: Variant) => {  //looping through variants
      const { color, size, stock,price_override, id} = variant
      const key = `${color}-${size}`
      if (variantMap.has(key)) {
        const existingVariant = variantMap.get(key);
        existingVariant.totalstock += stock; // Accumulate stock for the same color-size combination
      } else {
        variantMap.set(key, { color, size, totalstock: stock ,price_override, id});
      }
    })
    setSameVariant(Array.from(variantMap.values())) //converting map to array 
    console.log("samevariant",Array.from(variantMap.values()))
    setTotalStock(response.data.total_stock)
    setTotalStockHolder(response.data.total_stock) //storing total stock for default value
    
   })
  .catch ((error)=>{
    console.log(error)
  })
}
  
  useEffect (() => {
    updateVariantDetails()
  }, [selectedColor,selectedSize])

  const updateVariantDetails =() =>{
    let updatedStock = 0
    if (selectedColor && selectedSize) {
      const selectedVariant = sameVariant.find(
        (variant) => variant.color === selectedColor && variant.size === selectedSize
      );
      if (selectedVariant) {  
        setVariantId?.(selectedVariant.id)
        setProductPrice?.(selectedVariant.price_override || null);
        setTotalStock(selectedVariant.totalstock || 0);
      }
    } else if (selectedColor && !selectedSize) {
      updatedStock = sameVariant
        .filter((variant) => variant.color === selectedColor)
        .reduce((acc, variant) => acc + variant.totalstock, 0)
      setProductPrice?.(null)
      setTotalStock(updatedStock);
    } else if (selectedSize && !selectedColor) {
      updatedStock = sameVariant
        .filter((variant) => variant.size === selectedSize)
        .reduce((acc, variant) => acc + variant.totalstock, 0)
        setProductPrice?.(null)
      setTotalStock(updatedStock)
    } else {
      setProductPrice?.(null)
      setTotalStock(totalstockHolder)
    }
  }
const handleColorSelect = (color: string) => {
  selectedColor==color? setSelectedColor("") : setSelectedColor(color)
  setQuantity?.(1)
 }
 const handleSizeSelect = (size: string) => {
   selectedSize==size? setSelectedSize("") : setSelectedSize(size)
   setQuantity?.(1)
 }
    
  return (
      <div>
          {/* Color Variant */}
           <span className="font-semibold text-gray-800 ">
              <div className="text-base flex space-x-3 mb-2">
              <span className=" text-gray-600">Color</span>
              <div className="space-x-1">
              {Array.from(new Set(sameVariant.map((variant) => variant.color))).map((color) =>  {
                   const isDisabled = selectedSize && !sameVariant.some((variant) => variant.color === color && variant.size === selectedSize);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`px-2 cursor-pointer border ${
                       color === selectedColor && !isDisabled ? "border-blue-500 border-2" : ""
                      } disabled:cursor-not-allowed`}
                      disabled={isDisabled? true : false}
                      style={{ color: isDisabled ? "gray" : "black" }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
              </div>
            </span>
            {/* Size Variant */}
            <span className=" font-semibold text-gray-800">
              <div className="flex space-x-2 mb-2">
              <span className="text-base text-gray-600">Size</span>
              {sameVariant
            .map((variant) => variant.size) // Extract all sizes
            .reduce((uniqueSizes, size) => {
              if (!uniqueSizes.includes(size)) {
                uniqueSizes.push(size);
              }
              return uniqueSizes;
            }, [] as string[])
            .map((size) => {
              const isDisabled = selectedColor && !sameVariant.some((variant) => variant.color === selectedColor && variant.size === size);
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-2 cursor-pointer border ${
                    size === selectedSize && !isDisabled ? "border-blue-500 border-2" : ""
                  } disabled:cursor-not-allowed`}
                  style={{ color: isDisabled ? "gray" : "black" }}
                  disabled={isDisabled? true : false}
                >
                  {size}
                </button>
              );
            })}
              </div>
            </span>
        </div>
  )
}
