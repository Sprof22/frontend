import { NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    const backendURL = id 
      ? `http://localhost:3030/posts/${id}`
      : 'http://localhost:3030/posts';

    const response = await axios.get(backendURL, {
      headers: {
        Authorization: req.headers.get('Authorization') || ''
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Server error' },
      { status: error.response?.status || 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    console.log("Incoming request headers:", req.headers);
    
    const authHeader = req.headers.get('Authorization');
    console.log("Extracted Authorization header:", authHeader);

    const body = await req.json();
    console.log("Incoming request body:", body);

    const response = await axios.post('http://localhost:3030/posts', body, {
      headers: {
        Authorization: authHeader || '',
        'Content-Type': 'application/json'
      }
    });

    console.log("Backend response:", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error from backend:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Server error' },
      { status: error.response?.status || 500 }
    );
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    const response = await axios.patch(`http://localhost:3030/posts/${id}`, body, {
      headers: {
        Authorization: req.headers.get('Authorization') || '',
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Server error' },
      { status: error.response?.status || 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const response = await axios.delete(`http://localhost:3030/posts/${id}`, {
      headers: {
        Authorization: req.headers.get('Authorization') || ''
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Server error' },
      { status: error.response?.status || 500 }
    );
  }
};