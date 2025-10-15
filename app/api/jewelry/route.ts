import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock jewelry data
  const jewelry = [
    { id: 1, name: 'Diamond Ring', price: 1500 },
    { id: 2, name: 'Gold Necklace', price: 800 },
  ];
  
  return NextResponse.json(jewelry);
}

export async function POST(request: NextRequest) {
  const newItem = await request.json();
  
  // Add your jewelry creation logic here
  return NextResponse.json({ 
    message: 'Jewelry item created', 
    item: newItem 
  }, { status: 201 });
}
