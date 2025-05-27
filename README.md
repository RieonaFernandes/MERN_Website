<div align="center">
<pre>

<h3>A full-stack MERN finance tracker web application focused on security.</h3>

<p>FloQi is a smart application designed to help you stay on top of your finances. It provides you with a clear and 
   insightful view of your expenditure, which helps you influence your spending habits and accomplish your budgeting goals.
   Security is of prime focus, as financial data is highly sensitive. FloQi is cloaked with strong encryption and 
   authentication that ensures your financial data is private and protected.
   No matter if you want to track your expenses, prepare budgets, or you just need more control over your financial health, 
   with FloQi it is easy, secure, and extremely simple.</p>

<p><b> CURRENTLY WORKING ON!</b></p>

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

Right now it is a static home page.<br/>
It has a Nav bar and stats (static right now) on the home page.
<br/><br/>

<li><b>Profile Page</b></li>

You can see user information on this page and have an option to edit it (API creation/integration is not yet done).
</ul>

## Preview
<b>Home page:</b><br/><br/>
![alt text](https://github.com/RieonaFernandes/MERN_Website/blob/main/client/public/data/1.jpg)
<br/><br/><br/>
<b>Profile page:</b><br/><br/>
![alt text](https://github.com/RieonaFernandes/MERN_Website/blob/main/client/public/data/2.jpg)
<br/><br/><br/>
<b>Login page:</b><br/><br/>
![alt text](https://github.com/RieonaFernandes/MERN_Website/blob/main/client/public/data/3.jpg)
<br/><br/><br/>
<b>Sign up page:</b><br/><br/>
![alt text](https://github.com/RieonaFernandes/MERN_Website/blob/main/client/public/data/4.jpg)
