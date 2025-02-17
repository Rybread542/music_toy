


export function Input_Type({type}) {

            return (
                <>
                    <div className="input-type-form-details-artist-title">

                        <input type="text" id='artist-input' placeholder={type === 'playlist' ? 'Spotify Link' : "Artist"}/>

                        {type === 'album' || type ==='song' ? 
                        <input type="text" id='title-input' placeholder="Title"/> 
                        : 
                        null}

                    </div>

                    <div className="input-type-form-details-search">

                        <div className="search-img">
                            <img src="" alt="" />
                        </div>

                        <div className="search-info">

                            {type === 'album' || type === 'song' ? 
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