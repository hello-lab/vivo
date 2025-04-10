import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import YouTube from 'react-native-youtube-iframe';

const YOUTUBE_API_KEY = 'AIzaSyBTEwsjAwlV_H8BTd1ROXZ9Ztukoihfom8'; // Replace with your YouTube API key

const YouTubeSearch = ({ navigation }: { navigation: any }) => {
  const [videos, setVideos] = useState<any[]>([]); // To store the video list
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null); // To store the selected video ID
  const [selectedCategory, setSelectedCategory] = useState<string>('calming music'); // To track the selected category
  const [isPlayerReady, setIsPlayerReady] = useState(false); // To check if the YouTube player is ready
  const [error, setError] = useState<string | null>(null); // To store error message
  const [isPlaying, setIsPlaying] = useState(false); // To track whether the video is playing
  const [clicked, setClicked] = useState(false); // To track whether the video is playing
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
    const [backgroundcolor, setBackgroundcolor] = useState("");
    const [primarycolor, setPrimarycolor] = useState("");
    const [secondarycolor, setSecondarycolor] = useState("");
    const [tertiarycolor, setTertairycolor] = useState("");
    const [accentcolor, setAccentcolor] = useState("");
  
    AsyncStorage.getItem("backgroundcolor").then((value) => {
      setBackgroundcolor(String(value));
    });
    AsyncStorage.getItem("primary").then((value) => {
      setPrimarycolor(String(value));
    });
    AsyncStorage.getItem("secondary").then((value) => {
      setSecondarycolor(String(value));
    });
    AsyncStorage.getItem("tertiary").then((value) => {
      setTertairycolor(String(value));
    });
    AsyncStorage.getItem("accents").then((value) => {
      setAccentcolor(String(value));
    });
AsyncStorage.getItem('backgroundcolor').then((value) => {
    console.log(value);
setcolor(String(value))})
AsyncStorage.getItem('backgroundpic').then((value) => {
  console.log(value);
s(String(value))})
AsyncStorage.getItem('accents').then((value) => {
  console.log(value);
setcolor1(String(value))})
const styles = StyleSheet.create({
  sh:{
    backgroundColor: tertiarycolor,
    width: '100%',
    alignItems: 'center',
paddingTop: 20,
fontFamily:'HeadingNow',
borderTopRightRadius: 15,

  },
  thumbnailsContainer:{
    position: 'absolute',
    zIndex: 5,
    width: '100%',
    height: '100%',
    padding: 20,
    alignSelf: 'center',
    //alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    fontFamily:'HeadingNow',
    backgroundColor: 'rgba(37, 37, 37, 0.7)', // Semi-transparent background
    borderRadius: 15,
    display: 'flex',
  }
,
  container: {
    flex: 1,
    fontFamily:'HeadingNow',
    //alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    
    paddingTop: 50,
    borderRadius: 15,
   // backgroundColor: '#acb8c0',
  },
  header: {
    marginBottom: 10,
    fontFamily: 'HeadingNow',

  },
  title: {
    fontSize: 24,
   // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'HeadingNow',

  },
  categoryButtonContainer: {
    flexDirection: 'row',
    fontFamily: 'HeadingNow',


    marginBottom: -8, // Add margin between buttons and video list
  
    padding: 0,
    width: '100%',
  },
  categoryButton: {
    backgroundColor: primarycolor,
    borderRadius: 10,
    padding: 6,
    //marginLeft: 1,
    marginRight: 5,
    fontFamily: 'HeadingNow',
    paddingBottom: 15,
  },
  categoryButtonText: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'HeadingNow',

  },
  selectedCategoryButton: {
    backgroundColor: tertiarycolor, // Highlight selected category
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
    fontFamily: 'HeadingNow',

  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 15,
    fontFamily: 'HeadingNow',

  },
  thumbnails: {
    width: 250,
    height: 200,
    marginRight: 8,
    marginTop: 200,
    borderRadius: 15,
    fontFamily: 'HeadingNow',

  },
  videoTitle: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
    fontFamily: 'HeadingNow',

  },
  videoPlayer: {
    width: '100%',
    height: 300,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  videoTitleBox: {
    backgroundColor: primarycolor, // Semi-transparent background
    padding: 10,
   
    marginBottom: 20,
    borderRadius: 15,
    fontFamily: 'HeadingNow',

  },

  buttonpar:{
    
  },
  playPauseButton: {
   
    alignSelf: 'center',
  fontFamily: 'HeadingNow',
    backgroundColor: primarycolor,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: 55,
  },
  playPauseButtonText: {
    fontSize: 18,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: primarycolor,
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
const data =await response.json();      //console.log(JSON.parse(data))
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
    setClicked(true); // Set clicked to true
    setIsPlaying(true); // Set video to play on selection
  };

  const handleGoBack = () => {
    //setSelectedVideoId(null); // Reset video selection
    setClicked(false); // Reset clicked state
    //setIsPlaying(false); // Stop the video playback
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
      <Image 
        source={{ uri: backgroundpic }}
        style={StyleSheet.absoluteFill}
      />
        {(clicked)?
        <View style={styles.thumbnailsContainer}>
          {/* Display the thumbnail above the YouTube player */}
          
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>❌</Text>
          </TouchableOpacity>
          {/* Video title box */}
          

          {/* Display the YouTube player if a video is selected */}
          <YouTube
            videoId={selectedVideoId} // Use the selected video ID
            play={isPlaying} // Play or pause the video based on the state
            // Play in fullscreen
           height={200}
            onChangeState={handlePlayerStateChange} // Update the play state when video changes
            onReady={() => setIsPlayerReady(true)} // Set player ready flag
            onError={(e) => console.error('Error playing video:', e)} // Log errors
           
          />
          <View style={{alignContent: 'center', justifyContent: 'center',}}>
 <View style={styles.videoTitleBox}>
            <Text style={styles.videoTitle}>
              {videos.find((video) => video.id === selectedVideoId)?.title}
            </Text>
          </View>

        <View style={styles.buttonpar}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
         </View>
          </View>
        </View>:<></>}

        
        <>
          {/* Show error message if an error occurs */}
          {error && <Text style={styles.errorText}>{error}</Text>}

        

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
              onPress={() => handleCategoryChange('relaxing audiobooks for nicotine addiction ')}
              style={[
                styles.categoryButton,
                selectedCategory === 'relaxing audiobooks for nicotine addiction ' && styles.selectedCategoryButton,
              ]}
            >
              <Text style={styles.categoryButtonText}>Audiobooks</Text>
            </TouchableOpacity>
            
          </View>

<View style={styles.sh}>
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
          /></View>
        </>
      

      {/* Refresh Button at the bottom left */}
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
      </View>
  );
};


export default YouTubeSearch;
