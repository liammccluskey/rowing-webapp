### Dependencies
1. You will need to install npm for this project

### Installation instructions

1. Open project and cd into webapp
2. Create a ".env" file in the root folder "webapp" and paste the following code into it
```
  REACT_APP_API_BASE_URL=https://rowingapp-api.herokuapp.com
```
3. run the following commands
```
  npm install
  npm start
```
4. The site should now open at localhost:3000

### Server ENDPOINTS

1. GET /sessions ->   RESPONSE.data = [Session]
  - // GET all current sessions


2. GET /sessions/:sessionID ->  RESPONSE.data = Session
  - // GET a specifc session


3. POST /sessions  , body = {hostName: 'some name', title: 'some title'} -> RESPONSE.data = Session 
  - // POST a new session


4. PATCH /:sessionID/join , body={name: 'some name'}  -> RESPONSE.data = SessionMember  
  - // PATCH join a session

5. PATCH /:sessionID/members, body=SessionMember
  - // PATCH update a member's data in a session
  - // NOTE: should use useState() hook to save response of Endpoint.4 modify in componenet and resend every (5/10...) seconds

    
    
