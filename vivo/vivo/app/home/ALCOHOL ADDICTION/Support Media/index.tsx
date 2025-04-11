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
      //const data ={"kind":"youtube#searchListResponse","etag":"fV0oRKj6FDPU7PhQwM_Z0TQnBuQ","nextPageToken":"CAoQAA","regionCode":"IN","pageInfo":{"totalResults":1000000,"resultsPerPage":10},"items":[{"kind":"youtube#searchResult","etag":"vf8eSYGTMeAAoE_DhTbNuKpIcHM","id":{"kind":"youtube#video","videoId":"I3OJUwILelU"},"snippet":{"publishedAt":"2023-10-18T11:30:07Z","channelId":"UCVSaNtZoJMlx8SxLxsNa1lw","title":"Relaxing music Relieves stress, Anxiety and Depression 🌿 Heals the Mind, body and Soul - Deep Sleep","description":"Relaxing music Relieves stress, Anxiety and Depression Heals the Mind, body and Soul - Deep Sleep #piano #watersounds ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/I3OJUwILelU/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/I3OJUwILelU/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/I3OJUwILelU/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Relaxing Calming Music","liveBroadcastContent":"none","publishTime":"2023-10-18T11:30:07Z"}},{"kind":"youtube#searchResult","etag":"88dbV5jLaKJGyjWckkoLt-1Qrfk","id":{"kind":"youtube#video","videoId":"z-qigE1ym40"},"snippet":{"publishedAt":"2024-09-28T07:49:43Z","channelId":"UC7HtxPOje1ZqjGsxn_zbLbw","title":"Beautiful Relaxing Music - Stop Overthinking, Stress Relief Music, Sleep Music, Calming Music #242","description":"Beautiful Relaxing Music - Stop Overthinking, Stress Relief Music, Sleep Music, Calming Music #242 Bask in these exquisite ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/z-qigE1ym40/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/z-qigE1ym40/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/z-qigE1ym40/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Inner Peace Look Inside","liveBroadcastContent":"none","publishTime":"2024-09-28T07:49:43Z"}},{"kind":"youtube#searchResult","etag":"4MPSsm753sj2Mb0IqUt9-U54WMs","id":{"kind":"youtube#video","videoId":"1ZYbU82GVz4"},"snippet":{"publishedAt":"2016-07-03T17:09:48Z","channelId":"UCjzHeG1KWoonmf9d5KBvSiw","title":"Flying: Relaxing Sleep Music for Meditation, Stress Relief &amp; Relaxation by Peder B. Helland","description":"Relaxing sleep music for deep sleeping and stress relief. Fall asleep to beautiful nature videos and use the relaxing music ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/1ZYbU82GVz4/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/1ZYbU82GVz4/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/1ZYbU82GVz4/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Soothing Relaxation","liveBroadcastContent":"none","publishTime":"2016-07-03T17:09:48Z"}},{"kind":"youtube#searchResult","etag":"dfEM_e7AZnzjafhuH5b_T7upQSU","id":{"kind":"youtube#video","videoId":"YRJ6xoiRcpQ"},"snippet":{"publishedAt":"2023-10-12T16:08:13Z","channelId":"UCCaLwBoi-veAmQQFDuYhs4A","title":"30 Minute Deep Meditation Music for Positive Energy • Relax Mind Body, Inner Peace","description":"Enjoy this free 30 minute Meditation Music by Deep Breath - Relaxing Music! Practice meditation for anxiety relief to improve focus ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/YRJ6xoiRcpQ/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/YRJ6xoiRcpQ/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/YRJ6xoiRcpQ/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Deep Breath - Relaxing Music","liveBroadcastContent":"none","publishTime":"2023-10-12T16:08:13Z"}},{"kind":"youtube#searchResult","etag":"4KrAYGSzPxvbwWQJjm6fNWAK4Hw","id":{"kind":"youtube#video","videoId":"bP9gMpl1gyQ"},"snippet":{"publishedAt":"2020-04-11T14:15:48Z","channelId":"UCUZNK80DemBN3kyxusDLwrA","title":"Relaxing Sleep Music + Insomnia - Stress Relief, Relaxing Music, Deep Sleeping Music","description":"Relaxing Sleep Music + Insomnia - Stress Relief, Relaxing Music, Deep Sleeping Music Beautiful Piano Playlist ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/bP9gMpl1gyQ/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/bP9gMpl1gyQ/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/bP9gMpl1gyQ/hqdefault.jpg","width":480,"height":360}},"channelTitle":"The Soul of Wind","liveBroadcastContent":"none","publishTime":"2020-04-11T14:15:48Z"}},{"kind":"youtube#searchResult","etag":"wa7gok-eKImvBzQAc1H-BY9gH_0","id":{"kind":"youtube#video","videoId":"lFcSrYw-ARY"},"snippet":{"publishedAt":"2018-06-03T09:41:12Z","channelId":"UCb_kshGodseYhLPcDtxWv5w","title":"Beautiful Relaxing Music for Stress Relief ~ Calming Music ~ Meditation, Relaxation, Sleep, Spa","description":"Meditation Relax Music Channel presents a Relaxing Stress Relief Music Video with beautiful nature and calm Music for ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/lFcSrYw-ARY/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/lFcSrYw-ARY/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/lFcSrYw-ARY/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Meditation Relax Music","liveBroadcastContent":"none","publishTime":"2018-06-03T09:41:12Z"}},{"kind":"youtube#searchResult","etag":"aqJAAOse9PRjeZ_26lOV6HHHVms","id":{"kind":"youtube#video","videoId":"8p7LwCBgpCE"},"snippet":{"publishedAt":"2020-04-08T10:54:07Z","channelId":"UCR1xB4uPynHINFBUObGUDog","title":"Instant Relief from Anxiety &amp; Stress","description":"Provided to YouTube by CDBaby Instant Relief from Anxiety & Stress · Prabin Dangol Divine Light ℗ 2019 Prabin Dangol ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/8p7LwCBgpCE/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/8p7LwCBgpCE/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/8p7LwCBgpCE/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Prabin Dangol - Topic","liveBroadcastContent":"none","publishTime":"2020-04-08T10:54:07Z"}},{"kind":"youtube#searchResult","etag":"Bk_elxJZT9CIdD4YdLeX7FbTWps","id":{"kind":"youtube#video","videoId":"XgxRHa26JLo"},"snippet":{"publishedAt":"2021-11-15T16:16:16Z","channelId":"UCtJ6ylmIVLmxdycQvUQB6YQ","title":"Relaxing Music For Children - Be Calm and Focused (cute animals) | 3 Hours Extended Mix","description":"Kidzen presents: Dreamy Cat | Relaxing piano music for kids | 3 hours extended version INFORMATIONS FOR PARENTS: Soft ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/XgxRHa26JLo/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/XgxRHa26JLo/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/XgxRHa26JLo/hqdefault.jpg","width":480,"height":360}},"channelTitle":"KIDZEN - Music For Kids","liveBroadcastContent":"none","publishTime":"2021-11-15T16:16:16Z"}},{"kind":"youtube#searchResult","etag":"BZH0EL3zDwMjFduwP31e4-2W8ZQ","id":{"kind":"youtube#video","videoId":"jc79DuZHSns"},"snippet":{"publishedAt":"2025-04-09T11:31:06Z","channelId":"UC7cGnB4UUp9ljDxlmKrzzOQ","title":"12 Hours Of Dog Music🎵Calming Music for Dog Deep Sleep🐶💖Separation Anxiety Music for Dog Relaxation","description":"HEALING MUSIC channel is a music channel that makes relaxing dog Music& dog calming music,sleep music, stress relief music, ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/jc79DuZHSns/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/jc79DuZHSns/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/jc79DuZHSns/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Healing Music","liveBroadcastContent":"none","publishTime":"2025-04-09T11:31:06Z"}},{"kind":"youtube#searchResult","etag":"jXCSjCV55dZcO-i3DBJZXdm2dkE","id":{"kind":"youtube#video","videoId":"eKO9BGdQ7Wk"},"snippet":{"publishedAt":"2024-10-29T23:00:06Z","channelId":"UC0vI2alQtaxUMdQM1Re3RZA","title":"Relaxing Piano Music &amp; Rain Sounds for Deep Sleep, Stress Relief and Anxiety, Meditation, Calming","description":"Relaxing Piano Music & Rain Sounds for Deep Sleep, Stress Relief and Anxiety, Meditation, Calming ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/eKO9BGdQ7Wk/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/eKO9BGdQ7Wk/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/eKO9BGdQ7Wk/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Relaxing Rain Sleep Music","liveBroadcastContent":"none","publishTime":"2024-10-29T23:00:06Z"}}]}
      const data =await response.json(); // Parse the response as JSON
      //console.log(JSON.parse(data))
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

const styles = StyleSheet.create({
  sh:{
    backgroundColor: '#acb8c0',
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
    backgroundColor: '#91c4f6',
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
    backgroundColor: '#acb8c0', // Highlight selected category
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
    backgroundColor: '#91c4f6', // Semi-transparent background
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
    backgroundColor: '#91c4f6',
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
    backgroundColor: '#91c4f6',
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
