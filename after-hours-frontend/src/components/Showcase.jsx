import React, { useState, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

export default function FeaturedArtist() {
  const { theme } = useTheme();
  const audioRef = useRef(null);

  const initialArtist = {
    stageName: "Nova Ray",
    genre: "R&B / Neo-Soul",
    location: "Atlanta, GA",
    bio: "Late night R&B artist bringing smooth vocals and atmospheric beats.",
    image: null,
    tracks: [] // up to 5 tracks
  };

  const [artist, setArtist] = useState(initialArtist);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtist((prev) => ({
        ...prev,
        image: URL.createObjectURL(file)
      }));
    }
  };

  // Handle form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };

  // Track upload (1–5 max)
  const handleTrackUpload = (e) => {
    const files = Array.from(e.target.files);
    setArtist((prev) => ({
      ...prev,
      tracks: [...prev.tracks, ...files].slice(0, 5)
    }));
  };

  // Audio controls
  const playTrack = () => {
    if (artist.tracks.length > 0) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const stopTrack = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (artist.tracks.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % artist.tracks.length);
    }
  };

  const prevTrack = () => {
    if (artist.tracks.length > 0) {
      setCurrentTrackIndex(
        (prev) => (prev - 1 + artist.tracks.length) % artist.tracks.length
      );
    }
  };

  const shuffleTrack = () => {
    if (artist.tracks.length > 1) {
      const randomIndex = Math.floor(Math.random() * artist.tracks.length);
      setCurrentTrackIndex(randomIndex);
    }
  };

  const deleteTrack = (index) => {
    setArtist((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((_, i) => i !== index)
    }));
    if (currentTrackIndex >= artist.tracks.length - 1) setCurrentTrackIndex(0);
  };

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        minHeight: "60vh",
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.fontFamily,
        padding: "2rem 4rem"
      }}
    >
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <h1
          style={{
            color: theme.primary,
            fontSize: "3.5rem",
            marginBottom: "1rem",
            fontWeight: "800"
          }}
        >
          After Hours
        </h1>

        {/* Featured Artist Card */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            padding: "2rem",
            borderRadius: "12px",
            border: `3px solid ${theme.accent}`,
            background: theme.background,
            marginBottom: "2rem"
          }}
        >
          {/* Artist Photo */}
          <div style={{ position: "relative" }}>
            <img
              src={
                artist.image
                  ? artist.image
                  : `https://placehold.co/200x200/${theme.primary.replace(
                      "#",
                      ""
                    )}/${theme.text.replace("#", "")}?text=Upload+Photo`
              }
              alt={artist.stageName}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                border: `3px solid ${theme.primary}`,
                cursor: "pointer"
              }}
              onClick={() => document.getElementById("artistImageInput").click()}
            />
            <input
              type="file"
              id="artistImageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Artist Info & Track Upload */}
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="stageName"
              value={artist.stageName}
              onChange={handleChange}
              placeholder="Stage Name"
              style={{
                width: "100%",
                fontSize: "1.2rem",
                padding: ".5rem",
                marginBottom: ".5rem",
                borderRadius: "6px",
                border: `1px solid ${theme.accent}`
              }}
            />
            <input
              type="text"
              name="genre"
              value={artist.genre}
              onChange={handleChange}
              placeholder="Genre"
              style={{
                width: "100%",
                fontSize: "1.2rem",
                padding: ".5rem",
                marginBottom: ".5rem",
                borderRadius: "6px",
                border: `1px solid ${theme.accent}`
              }}
            />
            <input
              type="text"
              name="location"
              value={artist.location}
              onChange={handleChange}
              placeholder="Location"
              style={{
                width: "100%",
                fontSize: "1.2rem",
                padding: ".5rem",
                marginBottom: ".5rem",
                borderRadius: "6px",
                border: `1px solid ${theme.accent}`
              }}
            />
            <textarea
              name="bio"
              value={artist.bio}
              onChange={handleChange}
              placeholder="Artist Info / Bio"
              rows={3}
              style={{
                width: "100%",
                fontSize: "1rem",
                padding: ".5rem",
                borderRadius: "6px",
                border: `1px solid ${theme.accent}`,
                marginBottom: ".5rem"
              }}
            />

            {/* Track Upload */}
            <input
              type="file"
              multiple
              accept="audio/*"
              onChange={handleTrackUpload}
              disabled={artist.tracks.length >= 5}
              style={{ marginBottom: ".5rem" }}
            />
            <p>Tracks: {artist.tracks.length} / 5</p>

            {/* Track List */}
            {artist.tracks.map((track, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span>{track.name}</span>
                <button onClick={() => setCurrentTrackIndex(i)}>Play</button>
                <button onClick={() => deleteTrack(i)}>Delete</button>
              </div>
            ))}

            {/* Audio Player Controls */}
            {artist.tracks.length > 0 && (
              <div style={{ marginTop: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                <button onClick={prevTrack}>⏮ Prev</button>
                <button onClick={playTrack}>▶ Play</button>
                <button onClick={pauseTrack}>⏸ Pause</button>
                <button onClick={stopTrack}>⏹ Stop</button>
                <button onClick={nextTrack}>⏭ Next</button>
                <button onClick={shuffleTrack}>🔀 Shuffle</button>
              </div>
            )}

            {/* Hidden Audio Element */}
            {artist.tracks.length > 0 && (
              <audio
                ref={audioRef}
                src={artist.tracks[currentTrackIndex] && URL.createObjectURL(artist.tracks[currentTrackIndex])}
                onEnded={nextTrack}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}