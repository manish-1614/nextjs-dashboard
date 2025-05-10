"use client";

import Image from "next/image";
import { useState } from "react";

export default function Heart() {

  const [count, setCount] = useState(0);
  const [x, setX] = useState(30);
  const [y, setY] = useState(49);
  const thresold = 10;

  const handleClick = () => {
    setCount(count + 1);
    console.log("Clicked", count, " times");

    // generating random number in the range 5 to 80 and 5 to 90
    setX(Math.floor(Math.random() * 80 + 5));
    setY(Math.floor(Math.random() * 90 + 5));

    // console.log("x: ", x, " y: ", y);
  };

  return count < thresold ? (
    <>
      <div className="relative flex h-[90vh] w-11/12 items-center justify-center mx-2 ">
        <div className="flex flex-col items-center justify-center rounded-md bg-white p-2">
          <div className="text-2xl font-bold text-pink-900">
            Do you love me baby ?
          </div>
          <div className="p-2 flex items-center justify-center gap-4">
            <div
              onClick={handleClick}
              id="yes"
              style={{
                position: "absolute",
                top: count < thresold ? `${y}%` : "49%",
                left: count < thresold ? `${x}%` : "40%",
              }}
              className="py-2 px-4 border-2 border-red-200 rounded-md shadow-[0_0_10px_0_rgba(255,0,0,0.5)] text-center bg-red-200 hover:bg-red-300 transition-all duration-500 ease-in-out"
            >
              YES
            </div>
            <div className="ml-20 py-2 px-4 border-2 text-center bg-slate-200 rounded-md">
              NO
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div  className="flex flex-col gap-2 h-screen w-full items-center justify-center container">
        <p className="text-4xl text-center font-semibold text-pink-600">I Love You too baby 💏</p>
        <Image className="heart" src="/lovable/close_together.png" alt="closer together" width={500} height={500}/>
    </div>
  );
}
