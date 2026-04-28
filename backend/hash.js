import bcrypt from "bcrypt";

const password = "Mbahsteve1@";

const hash = await bcrypt.hash(password, 10);

console.log(hash);