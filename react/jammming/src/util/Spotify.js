let userAccessToken;
const clientId = '2cecc23bc5e44ef68acb469dae0af4df';
const redirectUri = 'http://JammingPP.surge.sh/';

const Spotify = {
    getAccessToken(){
        if(userAccessToken){
            return userAccessToken;
        } 
        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch=window.location.href.match(/expires_in=([^&]*)/);

        if(accessToken && expiresInMatch){
            userAccessToken = accessToken[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(()=> userAccessToken = '',expiresIn * 1000);
            window.history.pushState('Access Token', null , '/');
            return userAccessToken;
        }
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }

    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response=>{
            return response.json();
        }).then(jsonResponse =>{
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track=>({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },
    savePlayList(name,trackUris){
        if(!name || !trackUris.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me',{headers:headers}).then(response=>{
            return response.json();
        }).then(jsonResponse=>{
            userId=jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})
            }).then(response=> response.json())
            .then(jsonResponse=>{
                const playListId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/{user_id}/playlists/${playListId}/tracks`, {
                    headers:headers,
                    method: 'POST',
                    body: JSON.stringify({uris:trackUris})
                })
            })
        })
    }

}

export default Spotify;