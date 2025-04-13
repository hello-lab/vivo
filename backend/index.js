const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenAI } = require('@google/genai');
const fs = require("node:fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBm_lb6U_KnzPcw5XaxwI7VdQYCW0DNb40' });

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], err => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.json({ message: 'User registered' });
    });
  });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  });
});

// Public AI image generation
app.post("/gemini/generate", async (req, res) => {
    
  
  try{
    const { prompt } = req.body;
  `curl -X POST https://black-forest-labs-flux-1-schnell.hf.space/call/infer -s -H "Content-Type: application/json" -d '{
  "data": [
    "Hello!!",
    0,
    true,
    256,
    256,
    1
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N https://black-forest-labs-flux-1-schnell.hf.space/call/infer/$EVENT_ID`
let flag=true;
    fetch("https://black-forest-labs-flux-1-schnell.hf.space/call/infer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [prompt, 0, true, 720, 1600, 1]
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        const eventId = json.event_id;
        return new Promise((resolve, reject) => {
          function checkEvent() {
            fetch(`https://black-forest-labs-flux-1-schnell.hf.space/call/infer/${eventId}`)
              .then(res => res.text())
              .then(text => {
          if (text.includes('complete')) {
            
            resolve(text);
          } else {
            // Retry after 1 second if not complete
            setTimeout(checkEvent, 1000);
          }
              })
              .catch(reject);
          }
          checkEvent();
        });
            })
            .then(text => {
        imageurl = (text.split('\n')[1].split('"')[7]);
        console.log(text,imageurl)
      fetch(imageurl)
        .then(res => res.arrayBuffer())
        .then(buffer => {
          res.setHeader('Content-Type', 'image/png');
            res.json({ image: new Buffer.from(buffer).toString('base64') });
flag=false;
        })
        .catch(async error => {
          console.error("Error downloading image:", error);
          try {
            const { prompt } = req.body;
              if (!prompt) return res.status(400).json({ error: "Missing prompt." });
          
              const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-exp-image-generation",
                contents:  "Instruction:1.dont send any other text 2.Please Generate a picture of "+prompt,
                config: {
                    responseModalities: ["Text", "Image"],
                },
              });
              console.log(response);
              for (const part of response.candidates[0].content.parts) {
                // Based on the part type, either show the text or save the image
                if (part.text) {
                  console.log(part.text);
                } else if (part.inlineData) {
                  const imageData = part.inlineData.data;
                  const buffer = Buffer.from(imageData, "base64");
                  fs.writeFileSync("gemini-native-image.png", buffer);
                res.setHeader('Content-Type', 'image/png');
                //res.send(buffer);
              res.json({ image: imageData });
             }
                }
            } catch (error) {
              console.error("Gemini error:", error);
              res.status(500).json({ error: "Failed to generate image." });
            }
        //  console.log("Error downloading image:", peter);
          //res.status(500).json({ error: "Failed to download image" });
        });
      })
      if (!flag)
        console.log(peter)
  }




  catch{
  try {
    const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Missing prompt." });
  
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents:  "Instruction:1.dont send any other text 2.Please Generate a picture of "+prompt,
        config: {
            responseModalities: ["Text", "Image"],
        },
      });
      console.log(response);
      for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
        res.setHeader('Content-Type', 'image/png');
        //res.send(buffer);
      res.json({ image: imageData });
     }
        }
    } catch (error) {
      console.error("Gemini error:", error);
      res.status(500).json({ error: "Failed to generate image." });
    }}
  });
  
  const therapists = [
    {
      id: 12,
      image: "https://images.unsplash.com/flagged/photo-1571367034861-e6729ad9c2d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHwy",
      name: "Dr. Arjun Menon",
      specialization: "Sports Psychology",
      experience: "8 years",
      languages: ["English", "Hindi", "Malayalam"],
      about: "Dr. Menon specializes in sports psychology, helping athletes and fitness enthusiasts overcome mental barriers and achieve peak performance. He combines cognitive techniques with performance enhancement strategies.",
      hourlyRate: 2600,
      rating: 4.7,
      availability: "Mon-Sat",
      reviews: [
        { name: "Virat Singh", rating: 5, review: "Helped improve my athletic performance significantly." },
        { name: "Priya James", rating: 4.8, review: "Great techniques for handling competition anxiety." },
        { name: "Rahul Nair", rating: 4.7, review: "Excellent mental conditioning program." },
        { name: "Deepika Kumari", rating: 4.9, review: "Helped overcome performance blocks." },
        { name: "Ajay Rathore", rating: 4.6, review: "Very effective strategies for focus improvement." }
      ],
      hourlyAvailability: {
        Monday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: []
      }
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1558377235-76f53857000b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwd29tYW58ZW58MHx8MHx8fDI%3D",
      name: "Dr. Maya Krishnan",
      specialization: "Geriatric Psychology",
      experience: "16 years",
      languages: ["English", "Tamil", "Kannada"],
      about: "Dr. Krishnan focuses on mental health care for older adults, addressing age-related psychological concerns and helping seniors maintain cognitive wellness and emotional balance.",
      hourlyRate: 3000,
      rating: 4.9,
      availability: "Wed-Sun",
      reviews: [
        { name: "Ramesh Iyer", rating: 5, review: "Excellent support for age-related anxiety." },
        { name: "Lakshmi Rao", rating: 4.9, review: "Very patient and understanding approach." },
        { name: "Thomas Kurian", rating: 5, review: "Helped manage retirement transition." },
        { name: "Sarala Menon", rating: 4.8, review: "Great cognitive maintenance exercises." },
        { name: "George Matthew", rating: 4.9, review: "Wonderful support for elderly depression." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: [9, 10, 11, 12, 13, 14, 15, 16, 17]
      }
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1509839862600-309617c3201e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHwy",
      name: "Dr. Kavitha Shinde",
      specialization: "Art Therapy",
      experience: "10 years",
      languages: ["English", "Hindi", "Telugu", "Tamil"],
      about: "Dr. K. Shinde specializes in art therapy, helping patients express emotions and heal through creative processes. She combines traditional therapy with various artistic mediums to facilitate emotional healing and self-discovery.",
      hourlyRate: 2800,
      rating: 5.0,
      availability: "Tue-Sat",
      reviews: [
        { name: "Anita Desai", rating: 5, review: "Art therapy sessions helped me express suppressed emotions." },
        { name: "Rohit Kumar", rating: 4.8, review: "Creative approach to therapy really helped." },
        { name: "Meera Kapoor", rating: 5, review: "Amazing at helping identify and change self-defeating thoughts." },
        { name: "Arun Joshi", rating: 4.7, review: "Great experience with behavior modification techniques." },
        { name: "Neha Gupta", rating: 5, review: "Helped me develop better coping strategies for stress." },
        { name: "Vivek Shah", rating: 4.9, review: "Very knowledgeable about CBT and its applications." },
        { name: "Anjali Singh", rating: 5, review: "Her methods for managing anxiety are very effective." },
        { name: "Karan Mehta", rating: 4.8, review: "Excellent at teaching mindfulness techniques." },
        { name: "Deepa Reddy", rating: 5, review: "Really helped me overcome my social anxiety." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: []
      }
    },
    {
      id: 1,
      image: "https://img.freepik.com/free-photo/close-up-portrait-woman-with-beautiful-hair-closed-eyes_23-2148286126.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Priya Sharma",
      specialization: "Cognitive Behavioral Therapy",
      experience: "15 years",
      languages: ["English", "Hindi", "Bengali"],
      about: "Dr. Sharma is an expert in helping patients overcome negative thought patterns and behaviors. She has helped hundreds of clients develop better coping mechanisms and achieve mental wellness.",
      hourlyRate: 2500,
      rating: 4.9,
      availability: "Mon-Fri",
      reviews: [
        { name: "Amit Kumar", rating: 5, review: "Dr. Sharma helped me overcome my anxiety attacks through CBT techniques." },
        { name: "Priya Desai", rating: 5, review: "Her cognitive restructuring methods really helped change my negative thought patterns." },
        { name: "Rahul Sinha", rating: 4.8, review: "Very professional and effective in treating my depression with CBT." },
        { name: "Meera Kapoor", rating: 5, review: "Amazing at helping identify and change self-defeating thoughts." },
        { name: "Arun Joshi", rating: 4.7, review: "Great experience with behavior modification techniques." },
        { name: "Neha Gupta", rating: 5, review: "Helped me develop better coping strategies for stress." },
        { name: "Vivek Shah", rating: 4.9, review: "Very knowledgeable about CBT and its applications." },
        { name: "Anjali Singh", rating: 5, review: "Her methods for managing anxiety are very effective." },
        { name: "Karan Mehta", rating: 4.8, review: "Excellent at teaching mindfulness techniques." },
        { name: "Deepa Reddy", rating: 5, review: "Really helped me overcome my social anxiety." }
      ],
      hourlyAvailability: {
        Monday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [],
        Sunday: []
      }
    },
    {
      id: 2,
      image: "https://img.freepik.com/free-photo/young-man-thinking-with-pensive-expression-ai-generated_1194-588529.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Rajesh Patel",
      specialization: "Child Psychology",
      experience: "20 years",
      languages: ["English", "Hindi", "Gujarati"],
      about: "Dr. Patel specializes in child development and behavioral issues. His gentle approach helps children overcome developmental challenges and anxiety disorders.",
      hourlyRate: 2900,
      rating: 4.9,
      availability: "Wed-Sun",
      reviews: [
        { name: "Ritu Shah", rating: 5, review: "Dr. Patel helped my son overcome his learning difficulties." },
        { name: "Suresh Mehta", rating: 4.9, review: "Great with kids, my daughter's anxiety has improved significantly." },
        { name: "Anita Desai", rating: 5, review: "Very patient with children having ADHD." },
        { name: "Prakash Iyer", rating: 4.8, review: "Helped my child with behavioral issues at school." },
        { name: "Sheetal Patel", rating: 5, review: "Excellent in handling childhood trauma cases." },
        { name: "Rajiv Kumar", rating: 4.9, review: "Made my son comfortable in expressing his feelings." },
        { name: "Mira Thakur", rating: 5, review: "Great progress with my child's developmental delays." },
        { name: "Arjun Nair", rating: 4.8, review: "Helped with my daughter's social anxiety." },
        { name: "Kavita Singh", rating: 5, review: "Amazing improvement in my child's academic performance." },
        { name: "Rohit Sharma", rating: 4.9, review: "Very effective strategies for managing childhood stress." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: [9, 10, 11, 12, 13, 14, 15, 16, 17]
      }
    },
    {
      id: 5,
      image: "https://img.freepik.com/free-photo/beautiful-woman-standing-against-yellow-wall_23-2148204587.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Meera Singh",
      specialization: "Trauma Therapy",
      experience: "18 years",
      languages: ["English", "Hindi", "Punjabi"],
      about: "Dr. Singh is highly experienced in treating trauma and PTSD. She uses evidence-based approaches to help patients process traumatic experiences and rebuild their lives.",
      hourlyRate: 3200,
      rating: 4.8,
      availability: "Mon-Fri",
      reviews: [
        { name: "Sanjay Malhotra", rating: 5, review: "Helped me process childhood trauma effectively." },
        { name: "Preeti Khanna", rating: 4.8, review: "Excellent EMDR therapy for my PTSD." },
        { name: "Vikram Singh", rating: 5, review: "Finally finding peace after years of trauma." },
        { name: "Asha Rani", rating: 4.9, review: "Very understanding of complex trauma issues." },
        { name: "Nitin Verma", rating: 4.8, review: "Great progress in dealing with accident trauma." },
        { name: "Swati Gupta", rating: 5, review: "Helped me overcome domestic violence trauma." },
        { name: "Rajesh Kumar", rating: 4.7, review: "Professional and empathetic approach to trauma." },
        { name: "Priya Mathur", rating: 5, review: "Excellent in treating anxiety from past trauma." },
        { name: "Anil Kapoor", rating: 4.8, review: "Very effective trauma processing techniques." },
        { name: "Deepika Patel", rating: 5, review: "Helped me regain confidence after trauma." }
      ],
      hourlyAvailability: {
        Monday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [],
        Sunday: []
      }
    },
    {
      id: 6,
      image: "https://img.freepik.com/premium-photo/man-cheerful-studio-portrait-concept_53876-45003.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Rahul Verma",
      specialization: "Marriage Counseling",
      experience: "16 years",
      languages: ["English", "Hindi", "Marathi"],
      about: "Dr. Verma specializes in couples therapy and relationship counseling. He helps couples improve communication and resolve conflicts effectively.",
      hourlyRate: 3000,
      rating: 4.6,
      availability: "Tue-Sat",
      reviews: [
        { name: "Rajesh & Seema Kapoor", rating: 5, review: "Saved our marriage through effective counseling." },
        { name: "Amit & Neha Sharma", rating: 4.7, review: "Greatly improved our communication." },
        { name: "Vikrant & Pooja Mehta", rating: 4.8, review: "Helped us resolve long-standing issues." },
        { name: "Sunil & Reena Gupta", rating: 4.6, review: "Excellent conflict resolution techniques." },
        { name: "Arun & Maya Sinha", rating: 5, review: "Restored trust in our relationship." },
        { name: "Deepak & Ritu Malhotra", rating: 4.7, review: "Very effective couples therapy sessions." },
        { name: "Karan & Priya Ahuja", rating: 4.8, review: "Helped us understand each other better." },
        { name: "Nikhil & Swati Verma", rating: 4.5, review: "Great advice for newlyweds." },
        { name: "Rahul & Anjali Desai", rating: 5, review: "Transformed our marriage positively." },
        { name: "Vivek & Meera Shah", rating: 4.6, review: "Excellent pre-marriage counseling." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: []
      }
    },
    {
      id: 7,
      image: "https://img.freepik.com/premium-photo/hyper-realistic-beautiful-elegant-indian-woman-wearing-light-pink-linen-salwar-short-hair_862994-214714.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Neha Reddy",
      specialization: "Grief Counseling",
      experience: "12 years",
      languages: ["English", "Hindi", "Telugu"],
      about: "Dr. Reddy helps individuals navigate through loss and grief. Her compassionate approach supports patients in processing their emotions and finding healing.",
      hourlyRate: 2700,
      rating: 4.9,
      availability: "Mon-Wed",
      reviews: [
        { name: "Anita Raj", rating: 5, review: "Helped me cope with the loss of my spouse." },
        { name: "Suresh Kumar", rating: 4.9, review: "Excellent support during bereavement." },
        { name: "Meena Iyer", rating: 5, review: "Helped process grief after losing my parent." },
        { name: "Rajiv Malhotra", rating: 4.8, review: "Very understanding of complicated grief." },
        { name: "Priya Nair", rating: 5, review: "Compassionate approach to loss counseling." },
        { name: "Arun Sharma", rating: 4.9, review: "Helped my family through difficult times." },
        { name: "Lakshmi Rao", rating: 5, review: "Great support in processing childhood loss." },
        { name: "Vinod Kapoor", rating: 4.8, review: "Helped deal with pet loss grief." },
        { name: "Sunita Reddy", rating: 5, review: "Very effective grief processing techniques." },
        { name: "Karthik Menon", rating: 4.9, review: "Excellent guidance through mourning process." }
      ],
      hourlyAvailability: {
        Monday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      }
    },
    {
      id: 8,
      image: "https://img.freepik.com/premium-photo/cheerful-corporate-headshot-confident-man_687684-2517.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Vikram Malhotra",
      specialization: "Addiction Recovery",
      experience: "14 years",
      languages: ["English", "Hindi", "Punjabi"],
      about: "Dr. Malhotra is an expert in addiction treatment and recovery. He uses a holistic approach to help patients overcome substance dependencies and behavioral addictions.",
      hourlyRate: 3100,
      rating: 4.7,
      availability: "Thu-Sun",
      reviews: [
        { name: "Rahul Khanna", rating: 5, review: "Helped me overcome alcohol addiction." },
        { name: "Anjali Bose", rating: 4.8, review: "Great support for gaming addiction recovery." },
        { name: "Vikash Singh", rating: 4.7, review: "Effective treatment for substance abuse." },
        { name: "Neeta Sharma", rating: 5, review: "Helped with prescription drug dependency." },
        { name: "Amit Verma", rating: 4.6, review: "Excellent relapse prevention strategies." },
        { name: "Priya Malhotra", rating: 4.8, review: "Supportive approach to recovery." },
        { name: "Rajesh Gupta", rating: 5, review: "Great family addiction counseling." },
        { name: "Seema Kapoor", rating: 4.7, review: "Helped overcome behavioral addiction." },
        { name: "Arun Kumar", rating: 4.8, review: "Very effective addiction treatment program." },
        { name: "Maya Reddy", rating: 4.9, review: "Excellent long-term recovery support." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: [9, 10, 11, 12, 13, 14, 15, 16, 17]
      }
    },
    {
      id: 9,
      image: "https://img.freepik.com/premium-photo/woman-wearing-lanyard-with-lanyard-around-her-neck_403587-11434.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Pooja Iyer",
      specialization: "Eating Disorders",
      experience: "13 years",
      languages: ["English", "Hindi", "Malayalam"],
      about: "Dr. Iyer specializes in treating various eating disorders. She helps patients develop a healthy relationship with food and body image.",
      hourlyRate: 2900,
      rating: 4.8,
      availability: "Mon-Fri",
      reviews: [
        { name: "Meera Shah", rating: 5, review: "Recovered from bulimia with her help." },
        { name: "Riya Menon", rating: 4.8, review: "Excellent treatment for anorexia." },
        { name: "Ananya Gupta", rating: 5, review: "Helped overcome binge eating disorder." },
        { name: "Shweta Kumar", rating: 4.9, review: "Great approach to body image issues." },
        { name: "Nisha Patel", rating: 4.7, review: "Very effective eating disorder treatment." },
        { name: "Kavya Sharma", rating: 5, review: "Helped develop healthy eating habits." },
        { name: "Tanya Reddy", rating: 4.8, review: "Excellent support for recovery." },
        { name: "Prerna Singh", rating: 4.9, review: "Great progress with food anxiety." },
        { name: "Aisha Verma", rating: 5, review: "Very understanding of cultural factors." },
        { name: "Deepa Nair", rating: 4.8, review: "Helped establish normal eating patterns." }
      ],
      hourlyAvailability: {
        Monday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Tuesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [],
        Sunday: []
      }
    },
    {
      id: 10,
      image: "https://img.freepik.com/premium-photo/free-photo-close-up-aged-man_1124573-52233.jpg?ga=GA1.1.1545873260.1744484343&semt=ais_hybrid&w=740",
      name: "Dr. Sanjay Mehta",
      specialization: "PTSD Treatment",
      experience: "22 years",
      languages: ["English", "Hindi", "Gujarati"],
      about: "Dr. Mehta is a leading expert in PTSD treatment with extensive experience in trauma therapy. He uses evidence-based treatments to help patients recover from traumatic experiences.",
      hourlyRate: 3300,
      rating: 4.9,
      availability: "Wed-Sun",
      reviews: [
        { name: "Raj Kapoor", rating: 5, review: "Excellent PTSD treatment approach." },
        { name: "Sneha Verma", rating: 4.9, review: "Helped overcome military service PTSD." },
        { name: "Arjun Singh", rating: 5, review: "Very effective trauma treatment." },
        { name: "Divya Sharma", rating: 4.8, review: "Great progress with complex PTSD." },
        { name: "Karan Malhotra", rating: 5, review: "Helped with accident-related PTSD." },
        { name: "Neha Reddy", rating: 4.9, review: "Excellent trauma processing therapy." },
        { name: "Vijay Kumar", rating: 4.8, review: "Very understanding of combat PTSD." },
        { name: "Priyanka Gupta", rating: 5, review: "Helped overcome childhood trauma." },
        { name: "Aditya Patel", rating: 4.9, review: "Great improvement in PTSD symptoms." },
        { name: "Meenakshi Iyer", rating: 5, review: "Very effective EMDR therapy." }
      ],
      hourlyAvailability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Thursday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Friday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Saturday: [9, 10, 11, 12, 13, 14, 15, 16, 17],
        Sunday: [9, 10, 11, 12, 13, 14, 15, 16, 17]
      }
    }
  ];
                  app.get('/therapists', (req, res) => {
                    res.json(therapists);
                  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
