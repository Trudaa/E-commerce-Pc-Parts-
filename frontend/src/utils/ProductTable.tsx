import { Link } from "react-router-dom";

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    rating: number;
    variants: Variant[];
  };
  
  type Variant = {
    id: number;
    color: string;
    size: string;
    stock: number;
  };
  
  type ProductTableProps = {
    products: Product[];
  };
  
  export const ProductTable = ({ products }: ProductTableProps) => {


    console.log(products)

    return (
      <div className=" rounded-lg p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center bg-white p-2 rounded-lg shadow hover:shadow-xl text-center"
            >
              <button>
              <Link to={`/components/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-40 h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2 text-center">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2 text-center">
                {product.brand.toLocaleUpperCase()}
              </p>
              <p className="text-lg font-bold text-center">₱{product.price}</p>
              <div className="flex items-center justify-center mt-2">
                <span className="text-yellow-500">{product.rating}</span>              
              </div>   
              {/* {product.variants.map((variant) => (
               <div key={variant.id}>
                 <div>{variant.color}</div>
                 <div>{variant.size}</div>
               </div>
              ))} */}
              </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  