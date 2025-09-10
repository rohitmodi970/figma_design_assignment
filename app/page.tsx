"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import PatientDirectory from "@/components/ui/PatientDirectory";
export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="">
     {/* <Button onClick={() => setCount(count + 1)}>Click me</Button>
     <p>You clicked {count} times</p> */}
     <PatientDirectory/>
    </div>
  );
}
