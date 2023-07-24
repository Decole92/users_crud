const request = require("supertest");
const app = require("../index");
const pool = require("../config/dbConfig");

describe("User API", () => {
  //clean up the database before all tests
  beforeAll(async () => {
    await pool.query("DELETE FROM users");
  });
  // Clean up the database after all tests are done
  afterAll(async () => {
    await pool.query("DELETE FROM users");
  });

  const createUser = async (userData) => {
    const response = await request(app).post("/users").send(userData);
    return response.body;
  };

  const getUserById = async (userId) => {
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    return users[0];
  };

  test("should get all users", async () => {
    // Create some test users in the database
    const user1 = {
      name: "User 1",
      email: "user1@example.com",
      age: 25,
    };
    const user2 = {
      name: "User 2",
      email: "user2@example.com",
      age: 30,
    };

    await createUser(user1);
    await createUser(user2);

    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2); // We added 2 users in the database
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toBe(user1.name);
    expect(response.body[0].email).toBe(user1.email);
    expect(response.body[0].age).toBe(user1.age);
    expect(response.body[1]).toHaveProperty("id");
    expect(response.body[1].name).toBe(user2.name);
    expect(response.body[1].email).toBe(user2.email);
    expect(response.body[1].age).toBe(user2.age);
  });

  test("should create a new user", async () => {
    const newUser = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      age: 25,
    };

    const response = await createUser(newUser);

    expect(response).toHaveProperty("id");
    expect(response.name).toBe(newUser.name);
    expect(response.email).toBe(newUser.email);
    expect(response.age).toBe(newUser.age);

    // Verify the user exists in the database
    const userInDb = await getUserById(response.id);
    expect(userInDb).toMatchObject(newUser);
  });

  test("should update an existing user", async () => {
    // Create a test user in the database
    const newUser = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      age: 25,
    };
    const createdUser = await createUser(newUser);

    // Updated user data
    const updatedUser = {
      name: "Updated Name",
      email: "updated_email@example.com",
      age: 35,
    };

    const updateUserResponse = await request(app)
      .put(`/users/${createdUser.id}`)
      .send(updatedUser);

    expect(updateUserResponse.status).toBe(200);
    expect(parseInt(updateUserResponse.body.id)).toBe(createdUser.id);
    expect(updateUserResponse.body).toMatchObject(updatedUser);

    // Verify the user is updated in the database
    const userInDb = await getUserById(createdUser.id);
    expect(userInDb).toMatchObject(updatedUser);
  });

  test("should delete a user", async () => {
    // Create a test user in the database
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      age: 30,
    };
    const createdUser = await createUser(newUser);

    // Delete the user
    const deleteUserResponse = await request(app).delete(
      `/users/${createdUser.id}`
    );

    expect(deleteUserResponse.status).toBe(200);
    expect(deleteUserResponse.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );

    // Verify the user is deleted from the database
    const userInDb = await getUserById(createdUser.id);
    expect(userInDb).toBeUndefined();
  });

  test("should return 404 if trying to delete a non-existing user", async () => {
    const nonExistingUserId = 999;

    const deleteUserResponse = await request(app).delete(
      `/users/${nonExistingUserId}`
    );

    expect(deleteUserResponse.status).toBe(404);
    expect(deleteUserResponse.body).toHaveProperty("error", "User not found");
  });
});
