const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

// Allow cross-device requests
app.use(cors());
app.use(bodyParser.json());

const studentsFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/students/';
const instructorsFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/instructors/';
const coursesFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/courses/';
const paymentsFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/payments/';
const conversationsFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/conversations/';

const paymentsFile = path.join(paymentsFolder, 'payments.json');


// Create the payments.json file if it doesn't exist
if (!fs.existsSync(paymentsFile)) {
  fs.writeFileSync(paymentsFile, JSON.stringify({ transactions: [] }, null, 2));
}
// Create folder if it doesn't exist
if (!fs.existsSync(coursesFolder)) fs.mkdirSync(coursesFolder, { recursive: true });
// Create folders if they don't exist
if (!fs.existsSync(studentsFolder)) fs.mkdirSync(studentsFolder, { recursive: true });
if (!fs.existsSync(instructorsFolder)) fs.mkdirSync(instructorsFolder, { recursive: true });


// Signup Route
app.post('/signup', (req, res) => {
    const { fullname, username, email, password, gender, dateOfBirth, role } = req.body;

    if (!fullname || !username || !email || !password || !gender || !dateOfBirth || !role) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // Determine the folder based on role
    const folderPath = role === 'Student' ? studentsFolder : instructorsFolder;
    const filePath = `${folderPath}${username}.json`; // Use username as filename

    // Check if user already exists
    if (fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'User already exists!' });
    }

    // Save user data
    const userData = { fullname, username, email, password, gender, dateOfBirth, role };
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

    res.json({ message: '✅ Account created successfully!', userData });
});

// Fetch User Data Route
app.get('/user/:folder/:username', (req, res) => {
    const { folder, username } = req.params;
    const filePath = `C:/Users/GIVEN/Desktop/MobileApp/Learnify/${folder}/${username}.json`;

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'User not found!' });
    }

    // Read user data
    const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(userData);
});

app.get('/login/:role/:username/:password', (req, res) => {
    const { role, username, password } = req.params;
    const folder = role === 'Student' ? 'students' : 'instructors';
    const filePath = `C:/Users/GIVEN/Desktop/MobileApp/Learnify/${folder}/${username}.json`;

    // Check if the user exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'User not found!' });
    }

    // Read user data
    const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Compare passwords
    if (userData.password !== password) {
        return res.status(401).json({ error: 'Incorrect password!' });
    }

    // Send user details if authentication is successful
    res.json({
        name: userData.fullname,
        email: userData.email,
        username: userData.username,
        role: userData.role
    });
});

// Update Profile Route
app.post('/profile', (req, res) => {
    const { username, role } = req.body;
    if (!username || !role) {
        return res.status(400).json({ error: 'Username and role are required!' });
    }

    const folderPath = role === 'Student' ? studentsFolder : instructorsFolder;
    const filePath = `${folderPath}${username}.json`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'User not found!' });
    }

    // Overwrite with new data
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ message: '✅ Profile updated successfully!' });
});


// POST route to save course data
app.post('/course', (req, res) => {
    const courseData = req.body;
    const { courseTitle } = courseData;

    if (!courseTitle) {
        return res.status(400).json({ error: 'Course title is required!' });
    }

    const filePath = `${coursesFolder}${courseTitle}.json`;

    try {
        fs.writeFileSync(filePath, JSON.stringify(courseData, null, 2));
        res.json({ message: '✅ Course saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '❌ Failed to save course.' });
    }
});

// Example endpoint to serve courses based on instructor name
app.get('/courses', (req, res) => {
    const instructorName = req.query.instructorName;
    console.log(req);
    console.log(req.query);
    console.log(req.query.instructorName);
  
    if (!instructorName) {
      return res.status(400).json({ error: 'Instructor name is required' });
    }
  
    fs.readdir(coursesFolder, (err, files) => {
      if (err) {
        console.error('Error reading courses folder:', err);
        return res.status(500).json({ error: 'Failed to read courses folder' });
      }
  
      const courseList = [];
  
      files.forEach((file) => {
        const filePath = path.join(coursesFolder, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const courseData = JSON.parse(content);
  
          // Compare instructorName with the course instructor name
          if (courseData.instructorName === instructorName) {
            courseList.push(courseData);
          }
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
        }
      });
  
      res.json(courseList);
    });
  });
  
  // Endpoint to handle course updates
// app.post('/courses/update', (req, res) => {
//     const updatedCourse = req.body; // Get updated course data from the request body
//     console.log(updatedCourse);
//     const oldTitle = updatedCourse.courseTitle; // Original title
//     console.log(oldTitle);
//     const newTitle = updatedCourse.newTitle || oldTitle; // New title (if provided)
//     console.log(newTitle);
    
//     // Remove encodeURIComponent to avoid URL encoding spaces and special characters
//     const oldFilePath = path.join(coursesFolder, `${oldTitle}.json`);
//     const newFilePath = path.join(coursesFolder, `${newTitle}.json`);
    
//     // Print for debugging purposes
//     // console.log('Old File Path:', oldFilePath);
//     // console.log('New File Path:', newFilePath);
    
//     // Check if the course file exists
//     if (!fs.existsSync(oldFilePath)) {
//       console.log('File does not exist:', oldFilePath);
//       return res.status(404).json({ message: 'Course not found' });
//     } else {
//       console.log('File exists:', oldFilePath);
//     }
    
//     // Now we should rename the file if the title has changed
//     if (oldTitle !== newTitle) {
//       // Rename the file (this will overwrite if a file with the new title already exists)
//       fs.rename(oldFilePath, newFilePath, (err) => {
//         if (err) {
//           console.log('Error renaming file:', err);
//           return res.status(500).json({ message: 'Error renaming file' });
//         }
    
//         // Proceed with updating the course content
//         console.log(`File renamed to: ${newFilePath}`);
        
//         // Now update the file with the new course data
//         fs.writeFileSync(newFilePath, JSON.stringify(updatedCourse, null, 2));
        
//         // Send the response
//         res.status(200).json({ message: 'Course updated successfully' });
//       });
//     } else {
//       // If the title hasn't changed, just update the content
//       fs.writeFileSync(oldFilePath, JSON.stringify(updatedCourse, null, 2));
//       res.status(200).json({ message: 'Course updated successfully' });
//     }
    
//   });

app.post('/courses/update', (req, res) => {
    const updatedCourse = req.body; // Get updated course data from the request body
    console.log(updatedCourse);

    const oldTitle = updatedCourse.courseTitle; // Original title (this corresponds to the file)
    console.log(oldTitle);

    // Define the file path for the course based on the title
    const oldFilePath = path.join(coursesFolder, `${oldTitle}.json`);

    // Check if the course file exists
    if (!fs.existsSync(oldFilePath)) {
      console.log('File does not exist:', oldFilePath);
      return res.status(404).json({ message: 'Course not found' });
    } else {
      console.log('File exists:', oldFilePath);
    }

    // Read the existing course data from the file
    const existingCourseData = JSON.parse(fs.readFileSync(oldFilePath, 'utf8'));

    // Update the fields that exist in the request body
    if (updatedCourse.description) {
      existingCourseData.description = updatedCourse.description;
    }
    if (updatedCourse.category) {
      existingCourseData.category = updatedCourse.category;
    }
    if (updatedCourse.imageURL) {
      existingCourseData.imageURL = updatedCourse.imageURL;
    }
    if (updatedCourse.lessons) {
      existingCourseData.lessons = updatedCourse.lessons;
    }
    if (updatedCourse.quiz) {
      existingCourseData.quiz = updatedCourse.quiz;
    }
    if (updatedCourse.price) {
      existingCourseData.price = updatedCourse.price;
    }
    if (updatedCourse.state) {
      existingCourseData.state = updatedCourse.state;
    }
    if (updatedCourse.discount) {
      existingCourseData.discount = updatedCourse.discount;
    }
    if (updatedCourse.publish !== undefined) {
      existingCourseData.publish = updatedCourse.publish;
    }
    if (updatedCourse.visibility) {
      existingCourseData.visibility = updatedCourse.visibility;
    }
    if (updatedCourse.instructorName) {
      existingCourseData.instructorName = updatedCourse.instructorName;
    }

    // Write the updated data back to the file
    fs.writeFileSync(oldFilePath, JSON.stringify(existingCourseData, null, 2));

    // Send the response
    res.status(200).json({ message: 'Course content updated successfully' });
});

// DELETE endpoint to remove a course by courseTitle
app.delete('/courses/delete', (req, res) => {
    const { courseTitle } = req.body;
  
    if (!courseTitle) {
      return res.status(400).json({ message: 'Course title is required' });
    }
  
    // Create the filename that should exist based on the courseTitle
    const filename = `${courseTitle}.json`;
    const filePath = path.join(coursesFolder, filename);
  
    // Check if the file exists
    fs.exists(filePath, (exists) => {
      if (!exists) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to delete the course file' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
      });
    });
});
  

// Endpoint to fetch all courses
app.get('/api/courses', (req, res) => {
  fs.readdir(coursesFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading the courses folder.' });
    }

    // Filter for JSON files and read each course
    const coursePromises = files
      .filter(file => file.endsWith('.json')) // Only consider .json files
      .map((file) => {
        const courseName = path.basename(file, '.json'); // Extract course name without the .json extension
        const filePath = path.join(coursesFolder, file); // Full path to the file

        return new Promise((resolve, reject) => {
          // Read the JSON file
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              try {
                const courseData = JSON.parse(data); // Parse the JSON file data
                resolve({
                  courseName,
                  ...courseData, // Add the course data to the response
                });
              } catch (err) {
                reject(err);
              }
            }
          });
        });
      });

    // Wait for all the courses to be read and return the response
    Promise.all(coursePromises)
      .then(courses => {
        res.status(200).json({ courses }); // Send the courses array as a response
      })
      .catch(err => {
        res.status(500).json({ message: 'Error reading course data.', error: err.message });
      });
  });
});

// Endpoint to handle payment success and log transaction


// Handle the POST request for payment
// Handle the POST request for payment
app.post('/payment', (req, res) => {
  const paymentData = req.body;
  console.log(paymentData);

  // Generate timestamp for the payment
  const timestamp = new Date().toISOString();

  // Add the timestamp to the payment data
  const paymentWithTimestamp = {
    ...paymentData,
    timestamp,
  };

  // Read the existing payments from the payments.json file
  fs.readFile(paymentsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading payments file:', err);
      return res.status(500).json({ error: 'Error reading payments file' });
    }

    let payments = { transactions: [] };
    try {
      if (data) {
        // Ensure that the data is properly parsed as an object with a 'transactions' array
        payments = JSON.parse(data);
      }
    } catch (parseError) {
      console.error('Error parsing payments file:', parseError);
      return res.status(500).json({ error: 'Error parsing payments file' });
    }

    if (!Array.isArray(payments.transactions)) {
      // If 'transactions' is not an array, initialize it as an empty array
      payments.transactions = [];
    }

    // Add the new payment to the transactions array
    payments.transactions.push(paymentWithTimestamp);

    // Write the updated payments object back to the payments.json file
    fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2), (err) => {
      if (err) {
        console.error('Error writing to payments file:', err);
        return res.status(500).json({ error: 'Error writing to payments file' });
      }

      // Respond with success
      res.status(200).json({ success: true, message: 'Payment recorded successfully', payment: paymentWithTimestamp });
    });
  });
});

app.post('/add-payment-id', (req, res) => {
  const { username, paymentId } = req.body;

  if (!username || !paymentId) {
    return res.status(400).json({ success: false, message: 'Username and paymentId are required.' });
  }

  const studentFile = path.join(studentsFolder, `${username}.json`);

  fs.readFile(studentFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Student not found.' });
    }

    let student;
    try {
      student = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ success: false, message: 'Invalid student file format.' });
    }

    if (!Array.isArray(student.id)) {
      student.id = [];
    }

    student.id.push(paymentId);

    fs.writeFile(studentFile, JSON.stringify(student, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ success: false, message: 'Failed to update student file.' });
      }

      return res.json({ success: true, message: 'Payment ID added successfully.' });
    });
  });
});

// Endpoint to get the last payment ID
app.get('/last-payment-id', (req, res) => {
  try {
    const data = fs.readFileSync(paymentsFile, 'utf-8');
    const parsed = JSON.parse(data);

    if (!parsed.transactions || parsed.transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found.',
      });
    }

    const lastTransaction = parsed.transactions[parsed.transactions.length - 1];
    return res.json({
      success: true,
      paymentId: lastTransaction.id,
    });

  } catch (error) {
    console.error('Error reading payments file:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while reading payments file.',
    });
  }
});

// app.post('/enroll', (req, res) => {
//   // Log the incoming request body for debugging
//   console.log(req.body);

//   // Ensure the data exists in req.body
//   if (!req.body || !req.body.username || !req.body.paymentId || !req.body.courseTitle) {
//     return res.status(400).json({ message: 'Please provide username, paymentId, and courseTitle.' });
//   }

//   // Destructure the correct fields from req.body
//   const { username, paymentId, courseTitle } = req.body;

//   // Check if user already exists based on paymentId
//   const userExists = users.find(user => user.paymentId === paymentId);
//   if (userExists) {
//     return res.status(400).json({ message: 'User already enrolled.' });
//   }

//   // Enroll new user
//   const newUser = { username, paymentId, courseTitle };
//   users.push(newUser);

//   return res.status(201).json({ message: 'User successfully enrolled.', user: newUser });
// });

// Fetch course data
app.get('/courses/:courseTitle', (req, res) => {
  const courseTitle = req.params.courseTitle;
  const courseFile = path.join('C:/Users/GIVEN/Desktop/MobileApp/Learnify/courses', `${courseTitle}.json`);

  // Read course data
  fs.readFile(courseFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'Failed to read course data.' });
    }

    res.json(JSON.parse(data));
  });
});


// let users = [
//   {
//     fullname: "Kyateka Given Ethan",
//     username: "Giveth",
//     email: "givendarian@gmail.com",
//     password: "12345",
//     gender: "Male",
//     dateOfBirth: "2002-09-21",
//     role: "Student",
//     id: [uuidv4()],
//     userId: "john_doe_001",
//     enrolledCourses: {}
//   }
// ];

app.post('/enroll', (req, res) => {
  const { username, paymentId, courseTitle, courseData } = req.body;
  console.log(req.body);

  if (!username || !paymentId || !courseTitle || !courseData) {
    return res.status(400).json({ message: 'Missing required fields in request body.' });
  }

  const userFilePath = path.join(studentsFolder, `${username}.json`);

  if (!fs.existsSync(userFilePath)) {
    return res.status(404).json({ message: 'User file not found in students folder.' });
  }

  let user;
  try {
    user = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to read user file.' });
  }

  const courseKey = courseTitle.toLowerCase().replace(/\s+/g, '_');

  if (user.enrolledCourses && user.enrolledCourses[courseKey]) {
    return res.status(400).json({ message: 'User already enrolled in this course.' });
  }

  const enrolledCourse = {
    paymentId,
    courseTitle,
    enrolledOn: new Date().toISOString().split('T')[0],
    progress: {
      lessonsCompleted: [],
      quizzesCompleted: [],
      percentage: 0
    },
    certificateEarned: false,
    category: courseData.category,
    imageURL: courseData.imageURL,
    instructorName: courseData.instructorName,
    lessons: courseData.lessons.map((lesson, index) => ({
      lessonId: `lesson_${index + 1}`,
      title: lesson.title,
      embedLink: lesson.embedLink
    })),
    quiz: courseData.quiz.map((q, index) => ({
      quizId: `quiz_${index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }))
  };

  // Create enrolledCourses if not present
  if (!user.enrolledCourses) user.enrolledCourses = {};

  user.enrolledCourses[courseKey] = enrolledCourse;

  try {
    fs.writeFileSync(userFilePath, JSON.stringify(user, null, 2), 'utf-8');
  } catch (err) {
    return res.status(500).json({ message: 'Failed to write user file.' });
  }

  return res.status(201).json({
    message: 'Enrollment successful and file updated.',
    user
  });
});

// POST /user/enrolled-courses
app.post('/user/enrolled-courses', (req, res) => {
  const { username } = req.body;  // Retrieve username from request body
  console.log(req.body);

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required.' });
  }

  const filePath = path.join(studentsFolder, `${username}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'User file not found.' });
  }

  const userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!userData.enrolledCourses) {
    return res.status(200).json({ success: true, enrolledCourses: {} });
  }

  res.status(200).json({
    success: true,
    enrolledCourses: userData.enrolledCourses
  });
});

// Route to handle course submission
// Route to handle course submission
app.post('/user/save-course', (req, res) => {
  const { course, progress, courseAttempted, username } = req.body;

  // Define the folder where student data is stored
  const studentsFolder = 'C:/Users/GIVEN/Desktop/MobileApp/Learnify/students/';

  // Log the received data to the console (for testing)
  console.log('Received Course Data:', req.body);

  // Check if the students folder exists
  if (!fs.existsSync(studentsFolder)) {
    console.log('Students folder does not exist');
    return res.status(500).send({ success: false, message: 'Students folder does not exist' });
  }

  // Construct the file path for the user's data (e.g., "Giveth.json")
  const userFilePath = path.join(studentsFolder, `${username}.json`);

  // Check if the user file exists
  if (!fs.existsSync(userFilePath)) {
    console.log('User file does not exist');
    return res.status(404).send({ success: false, message: 'User data not found' });
  }

  // Read the user's data from the file
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading user file:', err);
      return res.status(500).send({ success: false, message: 'Error reading user data' });
    }

    // Parse the user data JSON
    const userData = JSON.parse(data);

    // Check if the course exists in the enrolledCourses
    const enrolledCourseKey = Object.keys(userData.enrolledCourses).find(courseKey => {
      return userData.enrolledCourses[courseKey].courseTitle === course.courseTitle;
    });

    if (enrolledCourseKey) {
      // The course exists in the enrolledCourses, now update the progress and courseAttempted
      const enrolledCourse = userData.enrolledCourses[enrolledCourseKey];

      // Update the course progress
      enrolledCourse.progress = { ...progress };

      // Mark the course as attempted
      enrolledCourse.courseAttempted = true;

      // Log the updated course data
      console.log('Updated Course:', enrolledCourse);

      // Write the updated data back to the file
      fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error writing to user file:', err);
          return res.status(500).send({ success: false, message: 'Error updating user data' });
        }

        // Respond with success
        return res.status(200).send({ success: true, message: 'Course progress updated successfully' });
      });
    } else {
      // Course doesn't exist in enrolledCourses
      console.log('Course not found in enrolled courses');
      return res.status(404).send({ success: false, message: 'Course not found in enrolled courses' });
    }
  });
});

app.post('/update-profile', (req, res) => {
  const incomingData = req.body;
  const username = incomingData.username;

  const studentFilePath = path.join(studentsFolder, `${username}.json`);

  // Check if file exists
  if (!fs.existsSync(studentFilePath)) {
    return res.status(404).send({ success: false, message: 'Student not found' });
  }

  try {
    // Read existing user data
    const existingData = JSON.parse(fs.readFileSync(studentFilePath, 'utf8'));

    // Keep enrolledCourses as it is, and username the same
    const updatedProfile = {
      ...existingData,
      ...incomingData,
      username: existingData.username,
      enrolledCourses: existingData.enrolledCourses
    };

    // Write updated data back to the file
    fs.writeFileSync(studentFilePath, JSON.stringify(updatedProfile, null, 2));

    console.log("✅ Profile updated for:", username);
    return res.status(200).send({
      success: true,
      message: 'Profile updated successfully. Username remains unchanged.'
    });

  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

app.post('/delete-account', (req, res) => {
  const { username } = req.body;
  const userFile = path.join(studentsFolder, `${username}.json`);

  
  console.log(username);
  console.log(userFile);


  if (fs.existsSync(userFile)) {
    fs.unlink(userFile, (err) => {
      if (err) {
        console.error('❌ Failed to delete user file:', err);
        return res.status(500).send({ success: false, message: 'Failed to delete user file' });
      }

      console.log(`✅ User file ${username}.json deleted successfully`);
      return res.status(200).send({ success: true, message: 'User account deleted successfully' });
    });
  } else {
    console.log('⚠️ User file not found');
    return res.status(404).send({ success: false, message: 'User file not found' });
  }
});


// Create a Nodemailer transporter (using a Gmail example, you can use any email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other provider
  auth: {
    user: 'givendarian@gmail.com',  // your email
    pass: 'htiybarwseyjwwoi ',  // your email password (or use OAuth2 for better security)
  },
});

// POST endpoint for sending emails
app.post('/send-email', (req, res) => {
  const { from, to, subject, message } = req.body;

  // Concatenate the 'from' email to the message
  const updatedMessage = `From: ${from}\n\n${message}`;

  console.log(`
    From: ${from}\n
    To: ${to}\n
    Subject: ${subject}\n
    Message: ${updatedMessage}\n
  `);

  // Define the email options
  const mailOptions = {
    from,  // Sender's email
    to,  // Recipient's email
    subject,  // Email subject
    text: updatedMessage,  // Email message with concatenated sender info
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({message: 'Email sent successfully'});
  });
});



app.get('/get/instructors', (req, res) => {
  // Read the instructors folder
  fs.readdir(instructorsFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading instructors folder', error: err.message });
    }

    if (files.length === 0) {
      return res.status(200).json({ message: 'No instructors were found' });
    }

    const instructors = [];

    // Read each file and push full name + email to array
    files.forEach((file) => {
      const filePath = path.join(instructorsFolder, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(fileContent);
        if (parsed.fullname && parsed.email) {
          instructors.push({
            fullname: parsed.fullname,
            email: parsed.email
          });
        }
      } catch (error) {
        console.error(`Failed to read file ${file}:`, error.message);
      }
    });

    res.status(200).json(instructors);
  });
});


app.get('/get/students', async (req, res) => {
  try {
    const files = fs.readdirSync(studentsFolder);

    if (files.length === 0) {
      return res.status(404).json({ message: "No students were found." });
    }

    const students = [];

    for (const file of files) {
      const filePath = path.join(studentsFolder, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      students.push({
        fullname: data.fullname,
        email: data.email
      });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error reading student files:", error);
    res.status(500).json({ message: "Server error while reading students." });
  }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});