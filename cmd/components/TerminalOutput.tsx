
import React from 'react';
import { TerminalLine, LineType } from '../types';

interface Props {
  history: TerminalLine[];
}

const TerminalOutput: React.FC<Props> = ({ history }) => {
  return (
    <div className="flex flex-col gap-1">
      {history.map((line) => (
        <div key={line.id} className="whitespace-pre-wrap break-words">
          {line.type === LineType.INPUT ? (
            <div className="flex gap-2">
              <span className="text-[#32d74b] font-bold">visitor@macbook-pro</span>
              <span className="text-white opacity-50">{line.path || '~'}</span>
              <span className="text-[#5e5ce6]">%</span>
              <span className="text-white">{line.content}</span>
            </div>
          ) : (
            <div className={`
              ${line.type === LineType.ERROR ? 'text-[#ff453a]' : ''}
              ${line.type === LineType.SYSTEM ? 'text-gray-400' : 'text-[#f0f0f0]'}
            `}>
              {line.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TerminalOutput;
