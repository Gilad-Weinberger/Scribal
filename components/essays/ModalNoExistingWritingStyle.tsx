import Link from "next/link";
import React from "react";

type ModalNoExistingWritingStyleProps = {
  onClose: () => void;
};

const ModalNoExistingWritingStyle = ({
  onClose,
}: ModalNoExistingWritingStyleProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <p className="w-full py-3 px-4 border-b-2 font-medium border-[#dfdfdf]">
          Missing Writing Style
        </p>
        <p className="py-4 px-4 pb-5 text-sm text-[#525252] border-b-2 border-[#dfdfdf]">
          You don&apos;t have any writing styles yet. Please create a new
          writing style to get started.
        </p>
        <div className="flex items-center justify-end gap-x-2 py-4 px-4">
          <button
            className="border-2 border-[#dfdfdf] text-sm px-3 py-1 rounded-md cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <Link
            className="bg-[#3456b2] text-sm text-white border-2 border-[#dfdfdf] cursor-pointer px-3 py-1 rounded-md"
            href="/writing-styles"
          >
            Create Writing Style
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModalNoExistingWritingStyle;
