export const selectAllUsers = `
SELECT u.* FROM users u 
`;

export const allUserCount =
    'SELECT COUNT(*) as total FROM users where status = 1';

export const insertUser =
    'INSERT INTO users\
(first_name, last_name, email, contact, user_name, password, status, created_by, created_at, updated_by, updated_at)\
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

export const updateUser =
    'UPDATE users \
SET first_name=?, last_name=?, email=?, contact=?, user_name=?,  status=?, user_role_id=?, updated_by=?, updated_time=?\
WHERE user_id= ?';

export const deleteUser =
    'UPDATE users SET status=?, deleted_by=?, deleted_time=?  WHERE user_id = ?';
