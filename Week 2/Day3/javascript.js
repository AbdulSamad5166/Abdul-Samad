//student data processing system//
const students = [
    {
        name: "Abdul",
        marks: 85,
        fees: 3000,
        department: "CS"
    },
    {
        name: "Ali",
        marks: 45,
        fees: 3000,
        department: "IT"
    },
    {
        name: "Ahmed",
        marks: 72,
        fees: 2500,
        department: "CS"
    },
    {
        name: "Usman",
        marks: 91,
        fees: 3500,
        department: "SE"
    }
];

// destructure student 0
const { name, marks, fees, department } = students[0];
console.log(name);
console.log(marks);
console.log(fees);
console.log(department);

// map for only student name
const names = students.map(student => student.name);
console.log(names);

// filter only passing students
const passingstudents = students.filter(student => student.marks >= 50);
console.log(passingstudents);

// find ahmed
const student = students.find(student => student.name === "Ahmed");
console.log(student);

// everystudentpass
const allpassed = students.every(student => student.marks >= 50);
console.log(allpassed);

// calculate fee
const totalfees = students.reduce((total, student) => total + student.fees, 0);
console.log(totalfees);

// object method on student 0
console.log(Object.keys(students[0]));
console.log(Object.values(students[0]));
console.log(Object.entries(students[0]));

// optional chaining
const city = students[0].address?.city ?? "City not available";
console.log(city);

// object spread
const updatedstudent = {
    ...students[0],
    name: "Hamza",
    marks: 78,
    fees: 3000,
    department: "CS"
};
console.log(updatedstudent);

// calculate total fees by rest
function calculatetotalfees(...studentsList) {
    return studentsList.reduce((total, student) => total + student.fees, 0);
}
console.log(calculatetotalfees(...students));