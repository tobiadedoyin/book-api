export default {
  createUser: `
        INSERT INTO 
            users(username, password)
        VALUES 
            ($(username), $(password))
        RETURNING id
    `,
  getUser: `
        SELECT
            users.id,
            username,
            password
        FROM
            users
        WHERE
            users.id = $1 OR username = $1
    `,
};
