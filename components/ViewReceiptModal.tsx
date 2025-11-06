import React from 'react';

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptImage: string | null;
}

const ViewReceiptModal: React.FC<ViewReceiptModalProps> = ({ isOpen, onClose, receiptImage }) => {
  if (!isOpen || !receiptImage) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-2xl p-4 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <img src={receiptImage} alt="Transaction Receipt" className="max-h-[80vh] w-auto mx-auto rounded-lg" />
        <button onClick={onClose} className="w-full mt-4 p-3 bg-primary text-dark-900 font-bold rounded-lg">Close</button>
      </div>
    </div>
  );
};

export default ViewReceiptModal;
