The following steps will help you to run and test the project:

Pre configuration

    Mongo

    1) Install MongoDB using Docker. Initialize the container: docker run --rm -d -p 27017:27017 --name mongodb mongo:4.2
    
    Node

    1) Install node v12.18.0

    NPM

    1) Install npm 6.14.4 

Execution

    API (On terminal, in the folder zenklub/api)

    1) Install dependencies: npm install
    2) Start server: node src/index.js
    3) Process starts on http://localhost:3333
    
Tests:

    JEST was used. To run tests: npm test