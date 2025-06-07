const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = async (plainPassword) => {
  if (!plainPassword) throw new Error("Password is required to hash");

  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash;
};

// (async() => {
//   let pass =await hashPassword("mawai@123")
//   console.log(pass)

//  })()
const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword)
    throw new Error("Both plain and hashed passwords are required");

  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
