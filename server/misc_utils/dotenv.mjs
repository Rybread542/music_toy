import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

export const spotifyClientID = process.env.SPOTIFY_API_CLIENT_ID
export const spotifyClientSecret = process.env.SPOTIFY_API_SECRET
export const youtubeAPIKey = process.env.YOUTUBE_API_KEY

export const dbHost = process.env.DB_HOST
export const dbPort = process.env.DB_PORT
export const dbUser = process.env.DB_USER
export const dbPass = process.env.DB_PASS
export const dbName = process.env.DB_NAME  
