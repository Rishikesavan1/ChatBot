"use client"
import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "../../components/Message";
import { DEFAULT_OPENAI_MODEL } from "@/utils/Constants";
import { useSession } from "next-auth/react";
import LogoBox from "@/components/logo";


const Chat = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showEmptyChat, setShowEmptyChat] = useState(true);
    const [conversation, setConversation] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const textAreaRef = useAutoResizeTextArea();
    const bottomOfChatRef = useRef<HTMLDivElement>(null);
    const [model, setModel] = useState("");
    const selectedModel = DEFAULT_OPENAI_MODEL;
    let API_URL; 
  
    const { data: session } = useSession();
  

  
    useEffect(() => {
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "24px";
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
      }, [message, textAreaRef]);
    
      useEffect(() => {
        if (bottomOfChatRef.current) {
          bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [conversation]);
    
      useEffect(() => {
        if (model === "") {
          setModel("Click to Select Model!")
        }
      })
    
      const sendMessage = async (e: any) => {
        e.preventDefault();
    
        // Don't send empty messages
        if (message.length < 1) {
          setErrorMessage("Please enter a message.");
          return;
        } else {
          setErrorMessage("");
        }
    
        if (model === "Click to Select Model!") {
          setErrorMessage("Please Select Model!");
          return;
        }
        else {
          setErrorMessage("");
        }
    
        setIsLoading(true);
    
        // Add the message to the conversation
        setConversation([
          ...conversation,
          { content: message, role: "user" },
          { content: null, role: "system" },
        ]);
    
        // Clear the message & remove empty chat
        setMessage("");
        setShowEmptyChat(false);
        if(model === ""){
          API_URL = `api/openai`
        } else {
          API_URL = "https://api-carla.onrender.com/predict"
        }

 
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [...conversation, { content: message, role: "user" }],
              model: selectedModel,
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
    
            // Add the message to the conversation
            setConversation([
              ...conversation,
              { content: message, role: "user" },
              { content: data.message, role: "system" },
            ]);
          } else {
            console.error(response);
            setErrorMessage(response.statusText);
          }
    
          setIsLoading(false);
        } catch (error: any) {
          console.error(error);
          setErrorMessage(error.message);
    
          setIsLoading(false);
        }
      };
    
      const handleKeypress = (e: any) => {
        // It's triggers by pressing the enter key
        if (e.keyCode == 13 && !e.shiftKey) {
          sendMessage(e);
          e.preventDefault();
        }
      };
    return (
       <div className="w-full h-full relative">
        <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full bg-gray-800">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b p-3  border-gray-900/50 bg-gray-700 text-gray-300">
                    Model: {model}
                  </div>
                  {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))}
                  <div className="w-full h-[100%] md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              {showEmptyChat ? (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                      <button
                      onClick={() => {
                        model === "Default (GPT-3.5)" ? setModel("Carla - Basic") : setModel("Default (GPT-3.5)")
                      }}
                        className="relative flex w-full cursor-pointer flex-col rounded-md border py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 border-white/20 bg-gray-800 sm:text-sm align-center"
                        id="headlessui-listbox-button-:r0:"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                      >
                        <label
                          className="block text-xs text-gray-500 text-center"
                          id="headlessui-listbox-label-:r1:"
                          data-headlessui-state=""
                        >
                          Model
                        </label>
                        <span className="inline-flex w-full truncate text-center justify-center">
                          <span className="flex h-6 items-center text-center gap-1 truncate text-white">
                            {model}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        </span>
                      </button>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-semibold text-center  text-gray-600 flex gap-2 items-center justify-center h-screen">
                  Carla
                  </h1>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm bg-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 border-white/20  md:border-transparent md:bg-vert-light-gradient bg-gray-800 md:!bg-transparent md:bg-vert-dark-gradient pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border   border-gray-900/50 text-white bg-gray-700 rounded-md  shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  ref={textAreaRef}
                  value={message}
                  tabIndex={0}
                  data-id="root"
                  placeholder="Send a message..."
                  className="h-[24px] max-h-[200px] overflow-y-hidden m-0 w-full resize-none border-0  p-0 pr-7 focus:ring-0 focus-visible:ring-0 bg-transparent pl-2 md:pl-0"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeypress}
                ></textarea>
                <button
                  disabled={isLoading || message?.length === 0}
                  onClick={sendMessage}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <FiSend className="h-4 w-4 mr-1 text-white " />
                </button>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs  text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
              ChatGPT Clone may produce inaccurate information about people,
              places, or facts.
            </span>
          </div>
        </div>
      </div>
    </div>
      );
    };
 
export default Chat;
