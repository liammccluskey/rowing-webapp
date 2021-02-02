### Dependencies
1. You will need to install npm for this project

### Installation instructions

1. Open project and cd into webapp
2. Create a ".env" file in the root folder "webapp" and paste the following code into it
  ## REACT_APP_API_BASE_URL=https://rowingapp-api.herokuapp.com
3. run the following commands
  ## npm install
  ## npm start
4. The site should now open at localhost:3000

### Server ENDPOINTS
    ## baseURL = (see above section.2)
// GET all current sessions
1. GET /sessions ->   RESPONSE.data = [Session]           // console.log() response to see structure

// GET a specifc session
2. GET /sessions/:sessionID ->  RESPONSE.data = Session   // consol.log() response to see structure

// POST a new session
3. POST /sessions  , body = {hostName: 'some name', title: 'some title'} -> RESPONSE.data = Session   // console.log() res to see structure

// PATCH join a session
4. PATCH /:sessionID/join , body={name: 'some name'}  -> RESPONSE.data = SessionMember    // print json to see structure

// PATCH update a member's data in a session
5. PATCH /:sessionID/members, body=SessionMember      // NOTE: should use useState() hook to save response of Endpoint.4 modify in componenet and resend every (5/10...) seconds

    
    
