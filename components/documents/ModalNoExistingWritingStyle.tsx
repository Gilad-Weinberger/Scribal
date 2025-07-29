import { useRouter } from "next/navigation";
import React from "react";

type ModalNoExistingWritingStyleProps = {
  onClose: () => void;
};

const ModalNoExistingWritingStyle = ({
  onClose,
}: ModalNoExistingWritingStyleProps) => {
  const router = useRouter();

  const handleCreateWritingStyle = () => {
    onClose();
    router.push("/writing-styles");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <p className="w-full py-3 px-4 border-b-2 font-medium border-border-default">
          Missing Writing Style
        </p>
        <p className="py-4 px-4 pb-5 text-sm text-text-secondary border-b-2 border-border-default">
          You don&apos;t have any writing styles yet. Please create a new
          writing style to get started.
        </p>
        <div className="flex items-center justify-end gap-x-2 py-4 px-4">
          <button
            className="border-2 border-border-default text-sm px-3 py-1 rounded-md cursor-pointer hover:bg-background-hover transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-sm text-white border-2 border-border-default cursor-pointer px-3 py-1 rounded-md hover:bg-primary-hover transition-colors"
            onClick={handleCreateWritingStyle}
          >
            Create Writing Style
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNoExistingWritingStyle;
