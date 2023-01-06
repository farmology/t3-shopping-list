import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { SetStateAction, useState } from "react";
import { ShoppingItem } from "@prisma/client";
import {HiX} from 'react-icons/hi'

const Home: NextPage = () => {
  const [input, setInput] = useState<string>('');
  const [items, setItems] = useState<ShoppingItem[]>([]); 
  const hello = trpc.example.hello.useQuery({ text: "from Earth" });
  const { mutate: addItem } = trpc.item.addItem.useMutation({
    onSuccess: (item) => {
      setItems((prev) => [...prev, item])
    },
  });
  const { mutate: deleteItem } = trpc.item.deleteItem.useMutation({
    onSuccess: (shoppingItem) => {
      setItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
    },
  });
  const { data: itemsData, isLoading } = trpc.item.getAllItems.useQuery(['items'], {
    onSuccess: (itemsData) => {
      setItems(itemsData)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput('');
  }
  
  if (!itemsData || isLoading) return <p>Loading...</p>
  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="A shopping list created with Nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Shopping</span> List
          </h1>
          <form onSubmit={handleSubmit}>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)} />
            <button  
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" 
              onClick={() => addItem({ name: input })}>
                Add item</button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <ul className="text-white mt-4">
              {items.map((item) => {
                const { id, name } = item
                return (
                <li key={id} className='flex items-center justify-between'>
                    <span>{name}</span>
                    <HiX onClick={() => deleteItem({id})}/>
                  </li>
                )
              })}
            </ul>
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
