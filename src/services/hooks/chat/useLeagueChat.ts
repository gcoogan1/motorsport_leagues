import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const FUNCTION_NAME = "chat-bot";

export const useLeagueChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about current league results and standings, or tell me you want help planning a GT7 league.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setIsLoading(true);
      setError(null);

      try {
        // supabase.functions.invoke handles the URL + anon key header for you,
        // since this edge function is deployed under your Supabase project.
        const { data, error: invokeError } = await supabase.functions.invoke(FUNCTION_NAME, {
          body: { messages: nextMessages },
        });

        if (invokeError) throw invokeError;
        if (data?.error) throw new Error(data.error);

        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      } catch (err) {
        console.error(err);
        setError("Something went wrong - please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  return { messages, sendMessage, isLoading, error };
};
