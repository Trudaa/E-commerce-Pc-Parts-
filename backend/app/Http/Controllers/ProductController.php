<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
   {
    $query = Product::with('variants');

    if ($request->has('filterBy')) {
        $filterBy = $request->input('filterBy');

        switch ($filterBy) {
            case 'HighToLow':
                $query->orderBy('price', 'desc');
                break;
            case 'LowToHigh':
                $query->orderBy('price', 'asc');
                break;
            case 'NewToOld':
                $query->orderBy('created_at', 'desc');
                break;
            case 'OldToNew':
                $query->orderBy('created_at', 'asc');
                break;
            case 'BestSelling':
                $query->orderBy('rating', 'desc');  
                break;
            default:
                break;
        }
    }

    // Apply price range filter
    if ($request->has('price_min') && $request->has('price_max')) {
        $query->whereBetween('price', [$request->input('price_min'), $request->input('price_max')]);
    }

    // // Apply availability filter
    if ($request->has('availability') && $request->input('availability') == true) {
       $query->whereHas('variants', function($query) {
           $query->where('stock', '>', 0);
       });
    }

    // Apply brand filter
    if ($request->has('brands')) {
        $brandsInput = $request->input('brands');
        if (is_string($brandsInput)) {
            $brands = explode(',', $brandsInput);
        } elseif (is_array($brandsInput)) {
            $brands = $brandsInput;
        } else {
            $brands = [];
        }
        $query->whereIn('brand', $brands);
    }

    // Apply color filter
    if ($request->has('colors')) {
        $colorsInput = $request->input('colors');
        
        if (is_string($colorsInput)) {
            $colors = explode(',', $colorsInput);
        } elseif (is_array($colorsInput)) {
            $colors = $colorsInput;
        } else {
            $colors = [];
        }
        $query->whereHas('variants', function($query) use ($colors) {
            $query->whereIn('color', $colors);   
        });
    }


    // Apply size filter
    if($request->has('sizes')) {
        $sizesInput = $request->input('sizes');
        if (is_string($sizesInput)) {
            $sizes = explode(',', $sizesInput);
        } elseif (is_array($sizesInput)) {
            $sizes = $sizesInput;
        } else {
            $sizes = [];
        }
         $query->whereHas('variants', function($query) use ($sizes) {
            $query->whereIn('size', $sizes);   
        });
    }
    

    if($request->has('search')) {
        $search = $request->input('search');
        $query->where(function ($subQuery) use ($search) {
            $subQuery->where('name', 'like', '%' . $search . '%')
                     ->orWhere('brand', 'like', '%' . $search . '%');
        });
    }


    // Paginate results
    $products = $query->select('id', 'name', 'price', 'image', 'brand', 'rating')
        ->paginate($request->input('per_page', 16));
    $totalproducts = $query->count();


    return response()->json([
        'data' => $products->items(),
        'current_page' => $products->currentPage(),
        'last_page' => $products->lastPage(),
        'total' => $totalproducts
    ]);

}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        // Fetch the product with all its variants
        $product = Product::with('variants')->find($id);
    
        // Initialize the variant stock to null
        $variantStock = null;
    
        // Check if color and size parameters are provided and not empty
        $color = $request->input('color');
        $size = $request->input('size');
    
        if (!empty($color) || !empty($size)) {
            // Find the specific variant matching the color and size, considering empty values
            $specificVariant = $product->variants->firstWhere(function ($variant) use ($color, $size) {
                return (empty($color) || $variant->color === $color) &&
                       (empty($size) || $variant->size === $size);
            });
    
            // If the specific variant exists, get its stock
            if ($specificVariant) {
                $variantStock = $specificVariant->stock;
            }
        }

   
        $totalStock = $product->variants->sum('stock');

        return response()->json([
            'product' => $product,
            'variant_stock' => $variantStock,
            'total_stock' => $totalStock
        ]);
    }
    


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function getProductVariants(Request $request)
    {
        $query = Product::with('variants');

        if ($request->has('colors')) {
            $colorsInput = $request->input('colors');

            if (is_string($colorsInput)) {
                $colors = explode(',', $colorsInput);
            } elseif (is_array($colorsInput)) {
                $colors = $colorsInput;
            } else {
                $colors = [];
            }
            $query->whereHas('variants', function($query) use ($colors) {
                $query->whereIn('color', $colors);
            });
        }

        $products = $query->select('id', 'name', 'price', 'image', 'brand', 'rating')
            ->paginate($request->input('per_page', 16));

        return response()->json($products);
    }
    
}
