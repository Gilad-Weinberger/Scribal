import { LayoutMain } from "@/components/ui";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <LayoutMain>
      <div className="px-42 py-18">Single Writing Style {id}</div>
    </LayoutMain>
  );
};

export default page;
