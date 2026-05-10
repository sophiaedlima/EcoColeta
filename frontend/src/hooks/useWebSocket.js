import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(solicitacaoId) {
  const [status, setStatus] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!solicitacaoId) return;

    const wsUrl = import.meta.env.VITE_WS_URL ?? 'http://localhost:8081';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsUrl}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/coleta/${solicitacaoId}`, (message) => {
          const payload = JSON.parse(message.body);
          setStatus(payload.status);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [solicitacaoId]);

  return status;
}
