import { useEffect } from "react";
import { fetchMessagesRequest } from "@/redux/messages/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Mirrors use-project-tasks.ts's shape: dispatches a fetch only when the
// cached messages don't match the requested channel, so switching between
// already-visited channels doesn't refire on every render.
export function useChannelMessages(channelId: string | undefined) {
  const dispatch = useAppDispatch();
  const { messages, messagesChannelId, messagesLoading } = useAppSelector((state) => state.messages);

  const stale = channelId !== undefined && messagesChannelId !== channelId;

  useEffect(() => {
    if (channelId && stale) {
      dispatch(fetchMessagesRequest(channelId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, stale]);

  return {
    messages: stale ? [] : messages,
    loading: stale || messagesLoading,
  };
}
