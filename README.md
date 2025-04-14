# Musific with Saavn API Integration

This project is a music streaming application that integrates with the Saavn API to fetch and play music.

## Features

- Search for songs
- Play/pause songs
- Skip to next/previous song
- Add songs to queue
- View trending songs
- View song details including artist information

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or 
yarn dev
```

## Using the Saavn API

This application uses the [Saavn API](https://saavn.dev/docs) to fetch music data. The API provides endpoints for:

- Searching songs
- Fetching song details
- Fetching trending songs
- Fetching playlists

### API Integration

The API integration is handled in the `src/services/api.js` file. The main API endpoints used are:

- `search/songs`: Search for songs
- `songs`: Get song details
- `playlists`: Get playlist details
- `trending`: Get trending songs

## Project Structure

- `src/services/api.js`: API service to handle Saavn API requests
- `src/context/MusicContext.jsx`: Context provider for managing music state
- `src/assets/player/Player.jsx`: Music player component
- `src/assets/player/Queue.jsx`: Queue component to display current and queued songs
- `src/assets/player/Card.jsx`: Card component to display song/playlist items
- `src/assets/Search.jsx`: Search component to search for songs
- `src/App.jsx`: Main application component

## License

This project is licensed under the MIT License - see the LICENSE file for details.
