

// let,const,var//
let age = 22;

age = 23;

console.log(age);

const year = 2026;

console.log(year);

//boolean//
let ali = 22;
console.log(ali >= 30);
//unndefined//
let ahmed;
console.log(ahmed);
//type of//
let temperature = "hot";
console.log(typeof temperature);

let isstudent = true;
console.log(typeof isstudent);
//assignment operators//
let x = 30;
x = x + 30;
console.log(x);
// operator assignment
let y = 16;
console.log(y >= 50);

// and or or not opertaor//
let ages = 18;
let hasidcard = true;
console.log(age >= 18 && hasidcard);

let hasCard = false;
let hasCash = true;

console.log(hasCard || hasCash);
//template literals//
let name = "Abdul";
let height = 22;

console.log(`My name is ${name} and I am ${height} years old.`);
//truthy and falsy//
if (1) {
    console.log("Yes");
} else {
    console.log("No");
}

//array//
let fruits = ["apple", "banana", "orange"];
console.log(fruits);
console.log(fruits.length);
console.log(fruits[0]);
fruits.push("grape");
console.log(fruits);
fruits.pop();
console.log(fruits);
fruits.shift();
console.log(fruits);
fruits.unshift("mango");
console.log(fruits);
fruits[1] = "Orange";
console.log(fruits);
//practical mini project of combination of all//
const student = {
    name: "Abdul",
    age: 22,
    subjects: ["JavaScript", "HTML", "CSS"],
    city: "Islamabad"
};

console.log(`Student Name: ${student.name}`);
console.log(`Age: ${student.age}`);
console.log(`City: ${student.city}`);

console.log("Subjects:");

console.log(student.subjects[0]);
console.log(student.subjects[1]);
console.log(student.subjects[2]);
//mini project 2//
const contact = {
    name: "Ali",
    age: 22,
    email: "[EMAIL_ADDRESS]",
    city: "Islamabad",
    isStudent: true
};

console.log("Contact Information:");
console.log(`Name: ${contact.name}`);
console.log(`Age: ${contact.age}`);
console.log(`City: ${contact.city}`);
console.log(`Email: ${contact.email}`);
console.log(`Student: ${contact.isStudent}`);   