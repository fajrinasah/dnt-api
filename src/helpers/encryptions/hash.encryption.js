import bcrypt from "bcrypt";

// HASHING A VALUE
function hash(value, salt) {
  return bcrypt.hashSync(value, salt);
}

// COMPARING A HASHED VALUES WITH ANOTHER HASHED VALUE
function compare(value, valueToCompare) {
  return bcrypt.compareSync(value, valueToCompare);
}
