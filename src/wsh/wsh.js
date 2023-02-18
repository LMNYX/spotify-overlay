import WebSocket, { WebSocketServer } from 'ws';
import { PresetOutput } from 'utilities/output';

export class WebSocketHandler
{
    constructor ()
    {
        this.Output = new PresetOutput('ws');
        this.ws = new WebSocketServer({
            port: 9897
        });
        this.Output.Log("WebSocket server started on port 9897");
    }

    request_broadcast(message)
    {
        try
        {
            this.ws.clients.forEach(client => { try { client.send(message); } catch {  } });
        } catch (e) {  }
    }

}