export function BuildSpotifyAuthLink(client_id, response_type, redirect_uri)
{
    return `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&scope=user-read-playback-state user-read-currently-playing user-read-playback-position&redirect_uri=${redirect_uri}`;
}

export function LoopedListener(wsh, spotify)
{
    try
    {
        setInterval(async () => {
            wsh.request_broadcast(JSON.stringify(await spotify.GetState()));
        }, 1000);
    }
    catch (e)
    {
        LoopedListener(wsh, spotify);
    }
}