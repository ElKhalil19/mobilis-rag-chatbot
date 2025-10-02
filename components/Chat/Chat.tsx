import { Message } from "@/types";
import { FC, useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend, onReset }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages or loading change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div>

      <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300 h-[550px]">
        {/* Messages container (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="my-1 sm:my-1.5">
              <ChatMessage message={message} />
            </div>
          ))}

          {loading && (
            <div className="my-1 sm:my-1.5">
              <ChatLoader />
            </div>
          )}

          {/* Dummy div to stick scroll */}
          <div ref={bottomRef} />
        </div>

        {/* Input always at bottom */}
        <div className="mt-2 flex-shrink-0">
          <ChatInput onSend={onSend} />
        </div>
      </div>
    </>
  );
};
