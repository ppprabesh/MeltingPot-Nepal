import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/model/Product';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the type query parameter
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    
    // Build the query based on the type parameter
    const query = type ? { type } : {};
    
    // Fetch products from the database
    const products = await Product.find(query);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 