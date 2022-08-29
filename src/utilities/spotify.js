import { PresetOutput } from 'utilities/output';
import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import 'dotenv/config';

export class SpotifyHelper
{
    constructor()
    {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: process.env.CLIENT_REDIRECT_URI
        });
        this.Output = new PresetOutput("spotify");
        this.isAuthorizationSaved = false;
        this.CheckForSavedAuthorizationCode();
        this.authorization_data = null;
    }

    CheckForSavedAuthorizationCode()
    {
        if(fs.existsSync("._config.json"))
        {
            var _config = JSON.parse(fs.readFileSync("._config.json"));
            if(_config.access_token && _config.refresh_token && _config.token_expirationepoch)
            {
                this.spotifyApi.setAccessToken(_config.access_token);
                this.spotifyApi.setRefreshToken(_config.refresh_token);
                this.tokenExpirationEpoch = _config.token_expirationepoch;
                this.isAuthorizationSaved = true;
                this.AnnounceAuthorization(true);
                this.CheckForNeededRefresh();
                return;
            }
        }
        else
        {
            fs.writeFileSync("._config.json", JSON.stringify({
                access_token: "",
                refresh_token: "",
                token_expirationepoch: 0
            }));    
        }

    }

    async AnnounceAuthorization(cached)
    {
        this.me = await this.spotifyApi.getMe();
        this.Output.Log(`Logged in as ${this.me.body.display_name.cyan}${cached ? ' from cache' : ''}.`);
    }

    async CheckForNeededRefresh()
    {
        if (this.tokenExpirationEpoch < new Date().getTime() / 1000)
        {
            console.log(this);
            this.Output.Log("Token expired. Refreshing...");
            var _d = await this.spotifyApi.refreshAccessToken();
            this.spotifyApi.setAccessToken(_d.body['access_token']);
        }
    }

    async authorize(code_grant)
    {
        
        var _auth_data = await this.spotifyApi.authorizationCodeGrant(code_grant);
        this.spotifyApi.setAccessToken(_auth_data.body['access_token']);
        this.spotifyApi.setRefreshToken(_auth_data.body['refresh_token']);
        this.tokenExpirationEpoch =
            new Date().getTime() / 1000 + _auth_data.body['expires_in'];

        fs.writeFileSync("._config.json", JSON.stringify({
            access_token: _auth_data.body['access_token'],
            refresh_token: _auth_data.body['refresh_token'],
            token_expirationepoch: this.tokenExpirationEpoch
        }));

        this.authorization_data = _auth_data;
        await this.AnnounceAuthorization();
        return true;
    }

    async GetState()
    {
        await this.CheckForNeededRefresh();
        try
        {
            var _playbackState = await this.spotifyApi.getMyCurrentPlaybackState();
            var _playingTrack = await this.spotifyApi.getMyCurrentPlayingTrack();
        } catch (e)
        {
            await new Promise(resolve => setTimeout(resolve, 500));
            return this.GetState();
        }
        return [_playbackState.body, _playingTrack.body];
    }
}