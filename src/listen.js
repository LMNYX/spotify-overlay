import 'dotenv/config';
import Output from 'utilities/output';
import Web from 'web/web';
import { BuildSpotifyAuthLink, LoopedListener } from 'utilities/misc';
import { SpotifyHelper } from 'utilities/spotify';
import { WebSocketHandler } from 'wsh/wsh';
import open from 'open';

const WebClient = new Web(7798);
const spotify = new SpotifyHelper();
const wsh = new WebSocketHandler();

(async () => {
    while (!WebClient.IsReady)
        await new Promise(resolve => setTimeout(resolve, 500));

    if(!spotify.isAuthorizationSaved)
    {
        open(BuildSpotifyAuthLink(process.env.CLIENT_ID, "code", process.env.CLIENT_REDIRECT_URI));
        Output.Log("Waiting for user to authenticate...");
        while (!WebClient.HasReturnedCode)
            await new Promise(resolve => setTimeout(resolve, 500));
        await spotify.authorize(WebClient.CodeReturned);
    }
    LoopedListener(wsh, spotify);
})().catch((e) => { throw e; });