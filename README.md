# users_crud

This is a simple User Management API that allows users to create, read, update, and delete user records.

## Installation

1. Clone the repository:
- git clone https://github.com/Decole92/users_crud.git

2. Navigate to the project directory:
   cd users_crud
   
3. Install dependencies using npm:
   npm install
   
4. Set up the database:
   - Create a MySQL database and update the database configuration in `config/dbConfig.js`.
   - Make sure to set your MySQL credentials as environment variables (e.g., using a .env file).
   - 
   NB: Run this command in your mysql terminal
    - CREATE TABLE users(
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(200) NOT NULL,
     email VARCHAR(250) NOT NULL,
     age INT NOT NULL
     );


5. Start the server:
   npm run dev

   ## Testing

To run the tests, use the following command:
npm test
- This will execute the test suite using Jest and Supertest.


## API Endpoints

- GET /users: Retrieve all users.
- POST /users: Create a new user.
- PUT /users/:id: Update an existing user by ID.
- DELETE /users/:id: Delete a user by ID.

## Usage

You can use tools like cURL, Postman, or any API client to interact with the endpoints.

Example cURL command to create a new user:
- curl -X POST http://localhost:8000/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'

Example cURL command to get all users:
- curl -X GET http://localhost:8000/users

Example cURL command to update a user:
- curl -X PUT http://localhost:8000/users/1 -H "Content-Type: application/json" -d '{"name": "Updated Name", "email": "updated@example.com", "age": 35}'

Example cURL command to delete a user:
- curl -X DELETE http://localhost:8000/users/1
