# Message Note

### A simple message note application created by React and Node.js
- At main branch, backend APIs are Restful API
- At graphql branch, backend APIs are GraphQL API
- Database is MongoDB Atlas

## Features

- Support user signup and login
- Post a new message note
- View, edit and delete a message note
- Pagination function. Every page only show two message notes
- Use socket.io to update UI real-time if another user creating or editing a message note

## Usage
For backend
```sh
cd root/backend
npm install
npm start
```
For frontend 
```sh
cd root/frontend
npm install
npm start
```
Connect to default URL http://localhost:3000/

## Future works

- Enhance error message
- Enhance log by debug or winston module
- Add testing by Mocha