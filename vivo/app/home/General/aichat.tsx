import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, StyleSheet, View, TouchableOpacity,Image, Linking } from 'react-native';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: any; user: string; id: string; style?: any }[]>([]);
  const [error, setError] = useState<string>('');
  const [aiName, setAiName] = useState<string>('Helper'); // Default AI name
  const [backgroundpic, s] = useState('');
      const [color, setcolor] = useState('');
      const [color1, setcolor1] = useState('');

    AsyncStorage.getItem('backgroundcolor').then((value) => {
        console.log(value);
    setcolor(String(value))})
    AsyncStorage.getItem('backgroundpic').then((value) => {
      console.log(value);
    s(String(value))})
    AsyncStorage.getItem('accents').then((value) => {
      console.log(value);
    setcolor1(String(value))})
  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { text: message, user: 'You', id: Math.random().toString() };
      setMessages((previousMessages) => [...previousMessages, userMessage]);
    
      setMessage(''); // Reset message input
      setError(''); // Reset error message

      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDmgd67c4lWZtjBPB99TUsETlJtqmhcUx4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: message }, // Use user input as the text to generate a response
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        console.log('Full API Response:', data);

        if (data.error) {
          setError(`Error: ${data.error.message}`);
          return;
        }

        if (!data?.candidates || data.candidates.length === 0) {
          setError('No response generated.');
          return;
        }

        const content = data?.candidates?.[0]?.content;
        let aiMessageText = 'Sorry, no response generated.';
        let aiMessageStyle = {}; // Default styles

        if (content && Array.isArray(content.parts) && content.parts.length > 0) {
          const generatedText = content.parts[0]?.text;
          if (generatedText) {
            aiMessageText = generatedText.trim();
          }
        }

        // Parse markdown text
        aiMessageText = parseMarkdown(aiMessageText);

        const aiMessage = {
          text: aiMessageText,
          user: aiName, // Use the dynamic AI name
          id: Math.random().toString(),
          style: aiMessageStyle, // Attach dynamic styles here
        };

        setMessages((previousMessages) => [...previousMessages, aiMessage]);
      } catch (error) {
        setError('Something went wrong!');
      }
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: color,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      fontSize: 16,
      color: '#333',
      backgroundColor: color1,
    },
    userMessage: {
      fontSize: 18,
      padding: 10,
      backgroundColor: '#91c4f6',
      borderRadius: 8,
      marginVertical: 4,
      fontFamily: 'Arial',
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    aiMessage: {
      fontSize: 18,
      padding: 10,
      backgroundColor: '#f1adc4',
      borderRadius: 8,
      marginVertical: 4,
      fontFamily: 'Courier New',
      color: '#00000',
      fontWeight: 'normal',
      textAlign: 'left',
    },
    boldText: {
      fontWeight: 'bold',
      color: '#000', // Make bold text black or customize the color
    },
    italicText: {
      fontStyle: 'italic',
      color: '#000', // Make italic text grey or customize the color
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    error: {
      color: 'red',
      marginTop: 12,
      fontSize: 14,
    },
  });
  
  // Function to parse Markdown and convert it into React Native components
  const parseMarkdown = (text: string) => {
    // Bold (**bold text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    text = text.replace(boldRegex, (match, p1) => {
      return `<bold>${p1}</bold>`;
    });

    // Italic (*italic text*)
    const italicRegex = /\*(.*?)\*/g;
    text = text.replace(italicRegex, (match, p1) => {
      return `<italic>${p1}</italic>`;
    });

    // Links [link text](URL)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    text = text.replace(linkRegex, (match, p1, p2) => {
      return `<link text="${p1}" href="${p2}">${p1}</link>`;
    });

    return renderTextWithMarkdown(text);
  };

  // Function to render the parsed Markdown text with React Native components
  const renderTextWithMarkdown = (text: string) => {
    // Split text by custom tags <bold>, <italic>, <link>
    const regex = /<(bold|italic|link)[^>]*>(.*?)<\/\1>/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add plain text before the tag
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      
      // Add bold text
      if (match[1] === 'bold') {
        elements.push(<Text key={Math.random()} style={styles.boldText}>{match[2]}</Text>);
      }
      // Add italic text
      else if (match[1] === 'italic') {
        elements.push(<Text key={Math.random()} style={styles.italicText}>{match[2]}</Text>);
      }
      // Add link text
      else if (match[1] === 'link') {
        elements.push(
          <Text key={Math.random()} style={styles.linkText} onPress={() => Linking.openURL(match[2])}>
            {match[2]}
          </Text>
        );
      }
      
      lastIndex = regex.lastIndex;
    }

    // Push the remaining plain text after the last tag
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={{ uri: backgroundpic }}
        style={StyleSheet.absoluteFill}
      />
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={[
              item.user === 'You' ? styles.userMessage : styles.aiMessage,
              item.style, // Apply dynamic style if present
            ]}
          >
            {item.user}: {item.text}
          </Text>
        )}
      />

      {/* Message Input and Send Button */}
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSendMessage} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  userMessage: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#91c4f6',
    borderRadius: 8,
    marginVertical: 4,
    fontFamily: 'Arial',
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  aiMessage: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#f1adc4',
    borderRadius: 8,
    marginVertical: 4,
    fontFamily: 'Courier New',
    color: '#00000',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000', // Make bold text black or customize the color
  },
  italicText: {
    fontStyle: 'italic',
    color: '#000', // Make italic text grey or customize the color
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 12,
    fontSize: 14,
  },
});

export default App;
