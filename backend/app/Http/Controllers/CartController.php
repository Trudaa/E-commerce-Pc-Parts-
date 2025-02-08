<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $products = Cart::all();
        // return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {  
      
        $validated = $request->validate([
            'userId' => 'required|exists:users,id',
            'productId' => 'exists:products,id',
            'variantId' => 'exists:product_variants,id',
            'quantity' => "integer|min:1",
            'cartProductId' => 'exists:carts,id', 
            'variantStock' => 'integer',
        ]);
        // Changing Variant Logic
        if ($request->input('variantId')&& $request->input('cartProductId')) {
            $cartItem = Cart::where('id', $validated['cartProductId'])
                ->where('user_id', $validated['userId'])
                ->first();
                if ($cartItem) {
                    // Check if another cart item already has the same product and new variant
                    $existingCartItem = Cart::where([
                        'user_id' => $validated['userId'],
                        'product_id' => $validated['productId'],
                        'product_variant_id' => $validated['variantId'],
                    ])->first();
        
                    $newQuantity = $cartItem->quantity;
        
                    // If the user inputs a quantity higher than the stock, set it to the max stock
                    if ($newQuantity > $validated['variantStock']) {
                        $newQuantity = $validated['variantStock'];
                    }
        
                    if ($existingCartItem) {
                        //combining the quantity of the existing cart item with the new quantity
                        $mergedQuantity = $existingCartItem->quantity + $newQuantity;
                        if ($mergedQuantity > $validated['variantStock']) {
                            $mergedQuantity = $validated['variantStock'];
                        }
                        // Delete the old cart item since it's a duplicate
                        $cartItem->delete();
                        $existingCartItem->update(['quantity' => $mergedQuantity]);
        
                        return response()->json([
                            'message' => 'Variant updated and merged successfully.',
                            'cartItem' => $existingCartItem,
                        ]);
                    } else {
                        // Just update the variant if no duplicate exists
                        $cartItem->update([
                            'product_variant_id' => $validated['variantId'],
                            'quantity' => $newQuantity
                        ]);
        
                        return response()->json([
                            'message' => 'Variant updated successfully',
                            'cartItem' => $cartItem,
                        ]);
                    }
                }
            // Updating Quantity Logic
        } else if ($request->input('quantity') && $request->input('cartProductId')) {
            $cartItem = Cart::where('id', $validated['cartProductId'])
            ->where('user_id', $validated['userId'])
            ->first();
    
        if ($cartItem) {
            $newQuantity = $request->input('quantity');
            $message = "Quantity updated to {$newQuantity}.";
            // If the user inputs a quantity higher than the stock, set it to the max stock
            if ($newQuantity > $validated['variantStock']) {
                $newQuantity = $validated['variantStock'];
                $message = "Requested quantity exceeds available stock. Set to maximum stock: {$newQuantity}.";
            } 
            // Update the cart item
            $cartItem->update([
                'quantity' => $newQuantity,
            ]);
    
            return response()->json([
                'message' => $message,
                'cartItem' => $cartItem,
            ]);
        }
        return response()->json(['message' => 'Cart item not found'], 404);
    }
        else { // Add to Cart Logic
            $existingQuantity = Cart::where([
                'user_id' => $validated['userId'],
                'product_id' => $validated['productId'],
                'product_variant_id' => $validated['variantId'],
            ])->value('quantity') ?? 0;
        
            $newQuantity = $existingQuantity + $validated['quantity'];
        
            if ($newQuantity > $validated['variantStock']) {
               return response()->json(['message' => 'You have reach the maximum quantity for this product'], 400);
            }
            $cartItem = Cart::updateOrCreate(
                [
                    'user_id' => $validated['userId'],
                    'product_id' => $validated['productId'],
                    'product_variant_id' => $validated['variantId'],
                ],
                [
                    'quantity' => $newQuantity,
                ]
            );
        }
}
   

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
        $cartItems = Cart::with(['product.variants'])->where('user_id', $id)->get();

        $cartItems = $cartItems->map(function ($cartItem) {
            $selectedVariant = $cartItem->product->variants->firstWhere('id', $cartItem->product_variant_id);
        
            $cartItem->selected_variant = $selectedVariant;
        
            return $cartItem;
        });
        
        return response()->json([
            'cartItems' => $cartItems,
            'cartCount' => $cartItems->Count()
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cartItem = Cart::find($id);
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }
        $cartItem->delete();
        return response()->json(['message' => 'Cart item deleted successfully'], 200);
    }
}
