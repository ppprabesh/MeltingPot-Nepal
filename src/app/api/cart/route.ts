import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/model/User'; // Assuming the UserModel has cart methods

// POST - Add item to cart
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId, productId, quantity } = await request.json();

    // Find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the product to the user's cart
    await user.addToCart(productId, quantity);
    return NextResponse.json({ message: "Product added to cart" }, { status: 200 });
  } catch (error) {
    // Check if error has message property
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

// GET - Retrieve the cart of a user
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { userId } = await request.json();

    // Find the user
    const user = await UserModel.findById(userId).populate('cart.product');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    // Check if error has message property
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { userId, productId } = await request.json();

    // Find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove the product from the cart
    await user.removeFromCart(productId);
    return NextResponse.json({ message: "Product removed from cart" }, { status: 200 });
  } catch (error) {
    // Check if error has message property
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

// PATCH - Update item quantity in the cart
export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const { userId, productId, quantity } = await request.json();

    // Find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the quantity of the product in the cart
    await user.updateCartItemQuantity(productId, quantity);
    return NextResponse.json({ message: "Cart item updated successfully" }, { status: 200 });
  } catch (error) {
    // Check if error has message property
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
