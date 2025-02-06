'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image'

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();
  console.log(user)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
      user && (
          <div>
            {/* <Image src={user.picture} alt={user.name} width={50} height={80} /> */}
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>ID Token: {user.idToken}</p>
          </div>
      )
  );
}