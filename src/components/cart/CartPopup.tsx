"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartPopup() {
  const { isOpen, items, totalPrice, removeItem, updateQuantity, toggleCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push("/checkout");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart} />
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={toggleCart}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item._id} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${item.price.toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.code}</p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item._id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Checkout
                </button>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{" "}
                  <button
                    type="button"
                    className="text-green-600 font-medium hover:text-green-500"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 