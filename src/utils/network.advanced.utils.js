export function createWebSocket(url, onMessage, onOpen, onClose, onError, options = {}) {
    let ws;
    let shouldReconnect = !!options.reconnect;
    let reconnectTimeout;
    function connect() {
        ws = new WebSocket(url, options.protocols);
        ws.onopen = (ev) => {
            onOpen?.(ev);
        };
        ws.onmessage = onMessage;
        ws.onerror = (ev) => {
            onError?.(ev);
            if (shouldReconnect)
                reconnect();
        };
        ws.onclose = (ev) => {
            onClose?.(ev);
            if (shouldReconnect)
                reconnect();
        };
    }
    function reconnect() {
        if (reconnectTimeout)
            clearTimeout(reconnectTimeout);
        reconnectTimeout = window.setTimeout(connect, options.reconnectInterval || 2000);
    }
    connect();
    return {
        get ws() {
            return ws;
        },
        send(data) {
            ws.send(data);
        },
        close() {
            shouldReconnect = false;
            ws.close();
            if (reconnectTimeout)
                clearTimeout(reconnectTimeout);
        }
    };
}
// SSE (Server-Sent Events) helper
export function createSSE(url, onMessage, onOpen, onError) {
    const es = new EventSource(url);
    es.onopen = onOpen || null;
    es.onmessage = onMessage;
    es.onerror = onError || null;
    return {
        es,
        close() {
            es.close();
        }
    };
}
// Simple GraphQL request helper
export async function graphqlRequest(endpoint, query, variables, headers) {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {})
        },
        body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors)
        throw json.errors;
    return json.data;
}
