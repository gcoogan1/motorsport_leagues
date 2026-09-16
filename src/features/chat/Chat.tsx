import { FormProvider, useForm } from "react-hook-form";

import ChatIcon from "@assets/Icon/Chat.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Button from "@/components/Button/Button";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import {
  Bubble,
  ChatBody,
  InputRow,
  MessageList,
  TypingBubble,
} from "./Chat.styles";
import { useLeagueChat } from "@/services/hooks/chat/useLeagueChat";

type ChatFormValues = {
  message: string;
};

const ChatWidget = () => {
  const { messages, sendMessage, isLoading, error } = useLeagueChat();
  const formMethods = useForm<ChatFormValues>({ defaultValues: { message: "" } });
  const { handleSubmit, reset } = formMethods;

  const handleOnSubmit = ({ message }: ChatFormValues) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    reset();
  };

  return (
    <PanelLayout panelTitleIcon={<ChatIcon />} panelTitle="AI Assistant">
      <ChatBody>
        <MessageList>
          {messages.map((message, i) => (
            <Bubble key={i} $role={message.role}>
              {message.content}
            </Bubble>
          ))}
          {isLoading && <TypingBubble $role="assistant">Thinking...</TypingBubble>}
          {error && <TypingBubble $role="assistant">{error}</TypingBubble>}
        </MessageList>

        <FormProvider {...formMethods}>
          <InputRow onSubmit={handleSubmit(handleOnSubmit)}>
            <TextInput
              name="message"
              placeholder="Type here..."
            />
            <Button type="submit" isLoading={isLoading} loadingText="Sending...">
              Send
            </Button>
          </InputRow>
        </FormProvider>
      </ChatBody>
    </PanelLayout>
  );
};

export default ChatWidget;
