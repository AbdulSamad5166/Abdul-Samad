// conditions//
function checkresults(marks) {
    if (marks >= 50) {
        return "pass";
    }
    else {
        return "fail";
    }

}
let result = checkresults(80);
console.log(result);



// for grading//
function getgrade(marks) {
    if (marks >= 90) {
        return "A";
    }
    else if (marks >= 80) {
        return "B";
    }
    else if (marks >= 70) {
        return "C";
    }
    else if (marks >= 60) {
        return "D";
    }
    else {
        return "F";
    }
}

console.log(getgrade(95));
//logical operators//
function checkage(age, haslicense) {
    if (age >= 18 && haslicense == true) {
        return "eligible";
    }
    else {
        return "not eligible";
    }

}
console.log(checkage(18, true));
//or//
function check(age, haslicense) {
    if (age >= 18 || haslicense == true) {
        return "eligible";
    }
    else {
        return "not eligible";
    }

}
console.log(check(18, false));

//not//
function checkweather(israining, iscloudy) {
    if (israining != true && iscloudy != true) {
        return "sunny";
    }
    else {
        return "not sunny";
    }

}
console.log(checkweather(false, false));


//switch//

function getstudentstatus(status) {
    switch (status) {
        case "active":
            return "student is currently enrolled";
            break;
        case "inactive":
            return "student is not enrolled";
            break;
        case "graduated":
            return "student has graduated";

        default:
            return "invalid status";

    }
}
console.log(getstudentstatus("active"));


//loops for//
for (let i = 0; i <= 10; i++) {
    console.log(i);
}
console.log("loop finished");


//loops while//
let count = 0;
while (count < 10) {
    console.log(count);
    count++;
}
console.log("loop finished");


//do while//
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 10);
console.log("loop finished");
////
function showstudentsid(numberofstudents) {
    for (let i = 1; i <= numberofstudents; i++) {
        console.log("student id is" + i);
    }
}
showstudentsid(7);


//while loop//

let students = ["Abdul", "Ali", "Ahmed"];
for (let student of students) {
    console.log(student);
}

function calculateTotal(price, quantity) {
    return price * quantity;
}
let total = calculateTotal(10, 20);
console.log(total);


function checkStudentResult(marks) {

    if (marks >= 50) {
        return "Pass";
    }

    return "Fail";
}
let result1 = checkStudentResult(80);
let result2 = checkStudentResult(40);

console.log(result1);
console.log(result2);

let Students = ["Abdul", "Ali", "Ahmed"];
function showStudents(students) {

    for (let student of students) {
        console.log("Student: " + student);
    }
}
showStudents(students);

function processStudent(name, callback) {

    console.log("Processing: " + name);

    callback();
}

function completed() {
    console.log("Student processing completed");
}

processStudent("Abdul", completed);


