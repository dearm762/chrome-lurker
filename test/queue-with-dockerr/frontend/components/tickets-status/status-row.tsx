import { ArrowRight } from 'lucide-react';

interface StatusRowProps {
  active?: boolean
  number: number | string
  window: number
  customStyle?:string
}

const StatusRow = ({ active = false, number, window, customStyle}: StatusRowProps) => {
  return (
    <div className={`w-full flex justify-between px-5 py-2 rounded mt-1 ${customStyle && customStyle} ${active && 'text-white bg-green-500'}`}>
      <p>{number}</p>
      <ArrowRight />
      <p>{window}</p>
    </div>
  );
};

export default StatusRow;