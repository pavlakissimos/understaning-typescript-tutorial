// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string];
// } = {
//   name: "Simos",
//   age: 24,
//   hobbies: ["Sports", "Coding"],
//   role: [2, "author"]
// };

enum Role {
  ADMIN = "ADMIN",
  READ_ONLY = 100,
  AUTHOR = 200
}

const person = {
  name: "Simos",
  age: 24,
  hobbies: ["Sports", "Coding"],
  role: Role.ADMIN
};

let favoriteActivities: string[];
favoriteActivities = ["Sports"];

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

if (person.role === Role.ADMIN) {
  console.log("is admin");
}
