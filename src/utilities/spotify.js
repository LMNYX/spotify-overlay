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
        this.authorization_data = null;
    }

    async authorize(code_grant)
    {
        
        var _auth_data = await this.spotifyApi.authorizationCodeGrant(code_grant);
        this.spotifyApi.setAccessToken(_auth_data.body['access_token']);
        this.spotifyApi.setRefreshToken(_auth_data.body['refresh_token']);
        this.tokenExpirationEpoch =
            new Date().getTime() / 1000 + _auth_data.body['expires_in'];
        console.log(
        'Retrieved token. It expires in ' +
            Math.floor(this.tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );
        this.authorization_data = _auth_data;
        this.me = await this.spotifyApi.getMe();

        this.Output.Log(`Logged in as ${this.me.body.display_name.cyan}.`);
        return true;
    }

    async GetState()
    {
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