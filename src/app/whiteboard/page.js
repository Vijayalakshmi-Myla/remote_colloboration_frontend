"use client";

import dynamic from "next/dynamic";

const Whiteboard = dynamic(() => import("@/components/Whiteboard"), {
  ssr: false, // disable server-side rendering
});

export default function WhiteboardPage() {
  return <Whiteboard />;
}
