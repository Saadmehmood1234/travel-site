// components/FAQItem.tsx
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

export default function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button 
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
}