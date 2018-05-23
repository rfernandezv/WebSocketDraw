package com.ads.websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * Endpoint which broadcasts incoming events to all connected peers.
 *
 * @author Pavel Bucek (pavel.bucek at oracle.com)
 */
@ServerEndpoint("/draw")
public class SocketDraw {

    private static Set<Session> peers = Collections.newSetFromMap(new ConcurrentHashMap<Session, Boolean>());

    @OnOpen
    public void onOpen(Session session) {
        peers.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        peers.remove(session);
    }

    @OnMessage
    public void shapeCreated(String message, Session client) throws IOException, EncodeException {
        for (Session otherSession : peers) {
            if (!otherSession.equals(client)) {
                otherSession.getBasicRemote().sendText(message);
            }
        }
    }
}
