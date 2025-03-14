


export function Input_Type({type, setArtist, setTitle, setLink}) {

            return (
                <>
                    <div className="input-type-form-details-artist-title">

                        <input type="text" id='artist-input' placeholder={type === 'playlist' ? 'Spotify Link' : "Artist"} 
                        onChange={type === 'playlist' ? 
                        (e) => setLink(e.target.value) 
                        : 
                        (e) => setArtist(e.target.value)}/>

                        {type === 'album' || type ==='track' ? 
                        <input type="text" id='title-input' placeholder="Title" onChange={(e) => setTitle(e.target.value)}/> 
                        : 
                        null}

                    </div>

                    <div className="input-type-form-details-search">

                        <div className="search-img">
                            <img src={null} alt="" />
                        </div>

                        <div className="search-info">

                            {type === 'album' || type === 'track' ? 
                            (<>
                            <p>Title</p>
                            <p>artist</p>
                            <p>year</p>
                            </>)
                            :
                            <p>Artist name or playlist title</p>}

                        </div>

                    </div>
                </>
            )
    }