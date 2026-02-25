import bcrypt from 'bcryptjs';
const hash = bcrypt.hashSync('faithgrace2025', 10);
console.log(hash);