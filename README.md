<div align="center">
<pre>

<h3>A full-stack MERN web application focused on security.</h3>

</pre>
</div>

## Setup

1. Clone this repo

2. Have mongodb database setup and running.

3. Use ```.env.example ``` file as a reference to create ```.env``` file and replace the values with your credentials/values.
   The URLs variable (used in CORS setup) should be replaced with the actual client URL when running locally. for example, ```http://localhost:3000```.


## Installation

npm install both the client and server folders seperately.
```sh
npm install
```

## Run Application
To run client. Navigate to client folder.
```sh
npm run dev
```
To run server. Navigate to server folder
```sh
node src/app.js
```
```sh
npm start
```

## API Documentation

Once you have your server running you can check the ```Swagger API documentation``` using the below URL

Replace ```<base-url>``` with your server's base URL.

```sh
http://<base-url>/docs
```

## Functionality
<ul>
<li><b>SignIn / SignUp Page</b></li>
  
  You can switch between user login and user registration options.<br/> 
  If you are not registered, then navigate to 'signup' option, enter your details and click register.<br/> 
  If you are  registered, then navigate to login page, enter your credentials and sign in.
<br/>
<br/>

<li><b>Home Page</b></li>

This is a static home page.<br/>
It has an Introduction and a Nav bar to help navigate between Home and Profile page.
<br/><br/>

<li><b>Profile Page</b></li>

You can see user information on this page and have an option to edit it (API creation/integration is not yet done).
