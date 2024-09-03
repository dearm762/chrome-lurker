import { tickets } from '@/app/(client)/ticket/page';
import StatusRow from './status-row';
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'

interface Ticket {
  active: boolean;
  number: number;
  window: number;
}

interface TicketsStatusProps {
  list: tickets[],
  lang: Language
}

const TicketsStatus = ({ list, lang }: TicketsStatusProps) => {
  return (
    <div className='bg-[#fbfbfb] w-full max-w-96 mx-auto p-5 rounded mt-5'>
      <p className='text-lg font-semibold flex justify-between'>
        <span>{locales[lang].ticket.TicketNumber}</span>
        <span>{locales[lang].ticket.Window}</span>
      </p>
      {list && list.length > 0 && list.map((card, index) => (
        <StatusRow key={index} active={card.active} number={parseInt(card.data.ticket.number)} window={card.data.window!} />
      ))}
    </div>
  );
};

export default TicketsStatus;