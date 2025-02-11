"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useRef } from "react";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const tokenFetched = useRef(false);

  // Redirect user to dashboard if logged in
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Fetch and store access token securely
  useEffect(() => {
    const fetchTokenAndRedirect = async () => {
      if (!isLoading && user && !tokenFetched.current) {
        try {
          const response = await fetch('/api/auth/token');
          const data = await response.json();
          if (data.accessToken) {
            sessionStorage.setItem('accessToken', data.accessToken);
            console.log("Access Token saved to sessionStorage");
          }
          tokenFetched.current = true; // Prevent multiple fetches
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    fetchTokenAndRedirect();
  }, [user, isLoading]);

  // Prevent flickering while redirecting
  if (isLoading || user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      {!user && (
        <>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Welcome to DEV API
          </h1>
          <p className="text-lg mb-8">A collaborative coding platform.</p>
          <div className="flex">
            <Link
              href="/api/auth/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
