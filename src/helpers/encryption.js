import bycript from "bcrypt";

// HASHING VALUE
export function hash(value) {
  return bycript.hashSync(value, 10);
}

// COMPARING A HASHED VALUES WITH ANOTHER HASHED VALUE
export function compare(value, valueToCompare) {
  return bycript.compareSync(value, valueToCompare);
}
