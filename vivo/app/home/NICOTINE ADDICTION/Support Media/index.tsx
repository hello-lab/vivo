import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import YouTube from 'react-native-youtube-iframe';

const YOUTUBE_API_KEY = 'AIzaSyA_mFSLuNJ_AadK6BEAfgU8xEkGWMkjG00'; // Replace with your YouTube API key

const YouTubeSearch = ({ navigation }: { navigation: any }) => {
  const [videos, setVideos] = useState<any[]>([]); // To store the video list
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null); // To store the selected video ID
  const [selectedCategory, setSelectedCategory] = useState<string>('calming music'); // To track the selected category
  const [isPlayerReady, setIsPlayerReady] = useState(false); // To check if the YouTube player is ready
  const [error, setError] = useState<string | null>(null); // To store error message
  const [isPlaying, setIsPlaying] = useState(false); // To track whether the video is playing

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]); // Re-fetch videos whenever the category changes

  // Fetch videos using YouTube API based on the selected category
  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
          selectedCategory
        )}&key=${YOUTUBE_API_KEY}&maxResults=10`
      );
      const data = await response.json();
      
      // Check if data.items exists
      if (data.items && Array.isArray(data.items)) {
        const videoList = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url, // Extract the medium thumbnail
        }));
        setVideos(videoList);
      } else {
        setError('No videos found or invalid response from YouTube API');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos');
    }
  };

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideoId(videoId); // Set the selected video ID
    setIsPlaying(true); // Set video to play on selection
  };

  const handleGoBack = () => {
    setSelectedVideoId(null); // Reset video selection
    setIsPlaying(false); // Stop the video playback
  };

  const handleRefresh = () => {
    fetchVideos(); // Refresh the video list
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); // Change the selected category
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle between play and pause
  };

  const handlePlayerStateChange = (event: any) => {
    if (event.state === 'playing') {
      setIsPlaying(true); // Video started playing
    } else if (event.state === 'paused') {
      setIsPlaying(false); // Video is paused
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button if video is selected */}
      {selectedVideoId ? (
        <>
          {/* Display the thumbnail above the YouTube player */}
          <View style={styles.thumbnailsContainer}>
            <Image
              source={{ uri: videos.find((video) => video.id === selectedVideoId)?.thumbnail }}
              style={styles.thumbnails}
            />
          </View>

          {/* Video title box */}
          <View style={styles.videoTitleBox}>
            <Text style={styles.videoTitle}>
              {videos.find((video) => video.id === selectedVideoId)?.title}
            </Text>
          </View>

          {/* Display the YouTube player if a video is selected */}
          <YouTube
            videoId={selectedVideoId} // Use the selected video ID
            play={isPlaying} // Play or pause the video based on the state
            fullscreen={true} // Play in fullscreen
            loop={false} // Disable looping
            onChangeState={handlePlayerStateChange} // Update the play state when video changes
            onReady={() => setIsPlayerReady(true)} // Set player ready flag
            onError={(e) => console.error('Error playing video:', e)} // Log errors
            style={styles.videoPlayer}
          />

          {/* Play/Pause Button */}
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseButtonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          {/* Back to Menu Button at the bottom */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Show error message if an error occurs */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.header}>
            {/* Relaxing Media Text */}
            <Text style={styles.title}>Relaxing Media</Text>
          </View>

          {/* Category Selection Buttons below Relaxing Media */}
          <View style={styles.categoryButtonContainer}>
            <TouchableOpacity
              onPress={() => handleCategoryChange('calming music')}
              style={[
                styles.categoryButton,
                selectedCategory === 'calming music' && styles.selectedCategoryButton,
              ]}
            >
              <Text style={styles.categoryButtonText}>Calming Music</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCategoryChange('relaxing audiobooks')}
              style={[
                styles.categoryButton,
                selectedCategory === 'relaxing audiobooks' && styles.selectedCategoryButton,
              ]}
            >
              <Text style={styles.categoryButtonText}>Audiobooks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCategoryChange('encouraging anti nicotine motivational quotes')}
              style={[
                styles.categoryButton,
                selectedCategory === 'motivational quotes' && styles.selectedCategoryButton,
              ]}
            >
              <Text style={styles.categoryButtonText}>Motivational Quotes</Text>
            </TouchableOpacity>
          </View>

          {/* Display list of videos */}
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectVideo(item.id)} style={styles.videoItem}>
                <View style={styles.videoItemContent}>
                  {/* Display thumbnail and video title */}
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  <Text style={styles.videoTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Refresh Button at the bottom left */}
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20, // Add margin between buttons and video list
  },
  categoryButton: {
    backgroundColor: '#91c4f6',
    borderRadius: 20,
    padding: 6,
    marginLeft: 5,
    marginRight: 5,
  },
  categoryButtonText: {
    fontSize: 14,
    color: 'white',
  },
  selectedCategoryButton: {
    backgroundColor: '#1e5175', // Highlight selected category
  },
  videoItem: {
    marginBottom: 15,
  },
  videoItemContent: {
    backgroundColor: '#e2e2e2',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    flexDirection: 'row',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 15,
  },
  thumbnails: {
    width: 250,
    height: 200,
    marginRight: 8,
    marginTop: 200,
    borderRadius: 15,
  },
  videoTitle: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  videoTitleBox: {
    backgroundColor: 'rgba(2, 163, 136, 0.7)', // Semi-transparent background
    padding: 10,
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -150 }],
    borderRadius: 15,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '59%',
    transform: [{ translateX: -50 }, { translateY: 50 }],
    backgroundColor: 'rgba(2, 163, 136, 0.7)',
    borderRadius: 25,
    padding: 15,
  },
  playPauseButtonText: {
    fontSize: 18,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    left: 138,
    backgroundColor: 'rgba(2, 163, 136, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'blac',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 50,
  },
  refreshButtonText: {
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default YouTubeSearch;
