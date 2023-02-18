# Spotify Overlay

This is a simple overlay, which is highly customizable for OBS Studio that displays the currently playing song on Spotify.

## Installation

```bash
yarn       # or npm install
yarn start # or npm start
```

## Customization

1. Create a new folder in the `overlays` folder and name it whatever you want.
2. Create a new HTML file, which will be the main file of your overlay.
3. Connect to the WebSocket server by using the following code:

```js
let socket = new ReconnectingWebSocket("ws://" + location.hostname + ":9897/");
```

4. Listen to the `message` event and parse the data, which will be a JSON string, an example of the data is shown below:

```json
[
    {
        "device": {
            "id": "...",
            "is_active": true,
            "is_private_session": false,
            "is_restricted": false,
            "name": "DESKTOP",
            "type": "Computer",
            "volume_percent": 100
        },
        "shuffle_state": false,
        "repeat_state": "off",
        "timestamp": 1676723696569,
        "context": {
            "external_urls": {
                "spotify": "https://open.spotify.com/playlist/..."
            },
            "href": "https://api.spotify.com/v1/playlists/...",
            "type": "playlist",
            "uri": "spotify:playlist:..."
        },
        "progress_ms": 98418,
        "item": {
            "album": {
                "album_type": "album",
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/1EowJ1WwkMzkCkRomFhui7"
                        },
                        "href": "https://api.spotify.com/v1/artists/1EowJ1WwkMzkCkRomFhui7",
                        "id": "1EowJ1WwkMzkCkRomFhui7",
                        "name": "RADWIMPS",
                        "type": "artist",
                        "uri": "spotify:artist:1EowJ1WwkMzkCkRomFhui7"
                    }
                ],
                "available_markets": [
                    "AD",
                    ...
                ],
                "external_urls": {
                    "spotify": "https://open.spotify.com/album/4qApTp9557qYZzRLEih4uP"
                },
                "href": "https://api.spotify.com/v1/albums/4qApTp9557qYZzRLEih4uP",
                "id": "4qApTp9557qYZzRLEih4uP",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/ab67616d0000b273cbbbea7d8fcf057f65071a85",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/ab67616d00001e02cbbbea7d8fcf057f65071a85",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/ab67616d00004851cbbbea7d8fcf057f65071a85",
                        "width": 64
                    }
                ],
                "name": "Your Name.",
                "release_date": "2016-08-24",
                "release_date_precision": "day",
                "total_tracks": 27,
                "type": "album",
                "uri": "spotify:album:4qApTp9557qYZzRLEih4uP"
            },
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/1EowJ1WwkMzkCkRomFhui7"
                    },
                    "href": "https://api.spotify.com/v1/artists/1EowJ1WwkMzkCkRomFhui7",
                    "id": "1EowJ1WwkMzkCkRomFhui7",
                    "name": "RADWIMPS",
                    "type": "artist",
                    "uri": "spotify:artist:1EowJ1WwkMzkCkRomFhui7"
                }
            ],
            "available_markets": [
                "AR",
                ...
            ],
            "disc_number": 1,
            "duration_ms": 537653,
            "explicit": false,
            "external_ids": {
                "isrc": "JPPO01618974"
            },
            "external_urls": {
                "spotify": "https://open.spotify.com/track/3A4FRzgve9BjfKbvVXRIFO"
            },
            "href": "https://api.spotify.com/v1/tracks/3A4FRzgve9BjfKbvVXRIFO",
            "id": "3A4FRzgve9BjfKbvVXRIFO",
            "is_local": false,
            "name": "Sparkle - movie ver.",
            "popularity": 62,
            "preview_url": "https://p.scdn.co/mp3-preview/cd77106c62c0f62d743a2ed3eb370fc785282b09?cid=1cd95ebc69fe403e9357d62436db1645",
            "track_number": 24,
            "type": "track",
            "uri": "spotify:track:3A4FRzgve9BjfKbvVXRIFO"
        },
        "currently_playing_type": "track",
        "actions": {
            "disallows": {
                "resuming": true,
                "skipping_prev": true
            }
        },
        "is_playing": true
    },
    ...
]
```
