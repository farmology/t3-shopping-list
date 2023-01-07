import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";


import { trpc } from "../utils/trpc";
import { useState } from "react";
import { ShoppingItem } from "@prisma/client";
import {HiX} from 'react-icons/hi'


const Home: NextPage = () => {
  const [input, setInput] = useState<string>('');
  const [items, setItems] = useState<ShoppingItem[]>([]); 
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  
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
  const { mutate: deleteAllItems } = trpc.item.deleteAllItems.useMutation({
    onSuccess: (items) => {
      setItems([])
      setCheckedItems([])
    },
  });
  const { mutate: toggleCheck } = trpc.item.toggleCheck.useMutation({
    onSuccess: (shoppingItem) => {
      if (checkedItems.some((item) => item.id === shoppingItem.id)) {
        setCheckedItems((prev) => prev.filter((item) => item.id !== shoppingItem.id))
      } else {
        setCheckedItems((prev) => [...prev, shoppingItem])
      }
    },
  });
  const { data: itemsData, isLoading } = trpc.item.getAllItems.useQuery(undefined, {
    onSuccess: (itemsData) => {
      setItems(itemsData)
      const checked = itemsData.filter((item) => item.checked === true)
      setCheckedItems(checked)
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
            <span className="text-[hsl(280,100%,70%)]">Shopping List</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <input type='text' value={input} onChange={(e) => setInput(e.target.value)} />
            <button  
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" 
              onClick={() => addItem({ name: input })}>
                Add item</button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <ul className="text-white text-3xl">
              {items.map((item) => {
                const { id, name } = item
                return (
                <li key={id} className='flex items-center justify-between'>
                    <span 
                      style={checkedItems.some((item) => item.id === id) ? {textDecoration: 'line-through'} : {}}
                      onClick={() => toggleCheck({id, checked: items.some((item) => item.id === id)})} 
                      className='cursor-pointer'
                    >
                      {name}
                    </span>
                    <HiX onClick={() => deleteItem({id})} className='cursor-pointer'/>
                </li>
                )
              })}
            </ul>
            <button  
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 mt-6" 
              onClick={() => deleteAllItems()}>
                Clear All
            </button>
            
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;


