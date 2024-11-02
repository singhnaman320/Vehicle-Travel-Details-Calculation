# Vehicle Travel Details Calculation
This repository deals with the code base Vehicle Travel Distance Calculation project.
<hr>
<hr>

vehicle-travel-app/<br/>
│<br/>
├── backend/<br/>
│   ├── controllers/<br/>
│   │   ├── tripController.js<br/>
│   │   └── authController.js<br/>
│   ├── models/<br/>
│   │   ├── Trip.js<br/>
│   │   └── User.js<br/>
│   ├── routes/
│   │   ├── tripRoutes.js<br/>
│   │   └── authRoutes.js<br/>
│   ├── middleware/<br/>
│   │   └── auth.js<br/>
│   ├── config/<br/>
│   │   └── db.js<br/>
│   ├── .env<br/>
│   ├── server.js<br/>
│   └── package.json<br/>
│<br/>
├── frontend/<br/>
│   ├── src/<br/>
│   │   ├── components/<br/>
│   │   │   ├── MapView.jsx<br/>
│   │   │   ├── Login.jsx<br/>
│   │   │   ├── Register.jsx<br/>
│   │   │   └── UploadTrip.jsx<br/>
|   |   |__ contexts
|   |   |   |__ AuthContext.jsx
|   |   |
│   │   ├── App.jsx<br/>
│   │   ├── main.jsx<br/>
│   │   └── router.js<br/>
│   ├── public/<br/>
│   ├── package.json<br/>
│   └── .env<br/>
│<br/>
└── README.md<br/>


<hr>
<h2>Installed Packages:</h2>
<h3> In root Package:: </h3>
Nodemon & Cuncurrently : For automatically restarting the server and run both Frontend and Backend together
<h3> Backend: </h3>
npm init -y<br/>
npm install express mongoose dotenv cors geolib multer jsonwebtoken bcryptjs csv-parser
<h3> Frontend: </h3>
npm create vite@latest <br/>
npm install axios leaflet react-leaflet<br/>
npm install react-bootstrap bootstrap
<hr>

<h2>Tech-Stacks and Tools:</h2>
<table width = 100%>
<tbody>
<tr align="top">
<td width="20%" align="center">
<h3 dir="auto"><span>VS Code</span><br><br></h3>
<a><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" height = "80" width = "80"></a>
</td>
<td width="20%" align="center">
<h3 dir="auto"><span>MongoDB</span><br><br></h3>
<a><img src="https://www.pngall.com/wp-content/uploads/13/Mongodb-Transparent.png" height = "80" width = "80"></a>
</td>
<td width="20%" align="center">
<h3 dir="auto"><span>React JS + Vite</span><br><br></h3>
<a><img src="https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png" height = "80" width = "80"></a>
</td>
<td width="20%" align="center">
<h3 dir="auto"><span>Bootstrap CSS</span><br><br></h3>
<a><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/800px-CSS3_logo.svg.png" height = "80" width = "80"></a>
</td>
<td width="20%" align="center">
<h3 dir="auto"><span>Node JS</span><br><br></h3>
<a><img src="https://images.credly.com/images/51aeb74b-ec87-4069-93fc-0ea449c8d77f/twitter_thumb_201604_node.png" height = "80" width = "80"></a>
</td>
</tr>
</td>
</tr>
</tbody>
</table>

<hr>
<h2>Functional Details:</h2>
<h3> To run both Frontend and Backend at the same time: </h3>
npm start<br/>

<h3> Steps: </h3>
1. User Login <br/>
<br/>
2. For no login credentials, Go to Register page. After registration, user data will be saved into MongoDB database. Now again try for login<br/>
<br/>
3. As soon as User login a Token will be generated which will be different for different user so that we can verify user each time. This token will be saved into browser storage because if we store generated token everytime into database, then it will increase burden on database and also on data retrival process.<br/>
<br/>
4. Now, once user login, we will be redirect user to trip upload page using CSV. Here user can upload CSV file and can see list of their trips. Here, buttons are provided for open your trip or delete your trip in each of the trip row. Clicking on open can open the trip in different page where tripName, gpsData, distance, duration, idlingDuration, stoppageDuration etc. can be shown.<br/>
<br/>
[NOTE]: No user can see other user details.<br/>
<hr>


