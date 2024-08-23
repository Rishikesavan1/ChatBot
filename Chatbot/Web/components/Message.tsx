import { HiUser } from "react-icons/hi";import { TbCursorText } from "react-icons/tb";
import ChatIcon from "@/public/chat.png";
import Image from "next/image";

const Message = (props: any) => {
  const { message } = props;
  const { role, content: text } = message;

  const isUser = role === "user";

  return (
    <div
      className={`group w-full  text-gray-100 border-b border-gray-900/50 ${
        isUser ? "bg-gray-800" : "bg-[#444654]"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
          <div className="w-10 flex flex-col relative items-end">
            <div className="relative h-10 w-10 m-0 rounded-sm text-white flex items-center justify-center bg-white text-opacity-100r overflow-visible">
              {isUser ? (
                <HiUser className="h-4 w-4 text-black spinOff" />
              ) : (
                <Image src={ChatIcon}  alt="chat" className="text-white object-fill img-spin" />
              )}
            </div>
            <div className="text-xs flex items-center justify-center gap-1 absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible !invisible">
              <button
                disabled
                className="text-gray-400"
              ></button>
              <span className="flex-grow flex-shrink-0">1 / 1</span>
              <button
                disabled
                className="text-gray-400"
              ></button>
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                <div className="markdown  w-full break-words prose-invert dark">
                  {!isUser && text === null ? (
                    <TbCursorText className="h-6 w-6 animate-pulse mt-[8px]" />
                  ) : (
                    <p>{text}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;