// ============================================================
// WEEK 4 - DAY 1: TypeScript Fundamentals
// Project: Mini Online Store
// File: day1-hands-on.ts
//
// Run karne ka tareeqa (terminal mein):
//   tsc day1-hands-on.ts
//   node day1-hands-on.js
// ============================================================
// ------------------------------------------------------------
// TOPIC 1, 2, 3: What is TypeScript? / JS vs TS / Why TypeScript
// ------------------------------------------------------------
// Yeh theory topics hain, in ka code yeh poori file hi hai:
// - Yeh file .ts hai, browser/node ko .js chahiye (tsc convert karta hai).
// - Types sirf development mein check hoti hain, final JS mein nahi hoti.
// - Neeche har galti jo TypeScript pakadta hai, JavaScript mein chup
//   chaap chal jati. Isi liye modern frontend mein TypeScript use hota hai.
// ------------------------------------------------------------
// TOPIC 4 + 5: Type annotations + Primitive types
// Syntax: variableName: type = value
// ------------------------------------------------------------
const storeName = "TechMart";
const taxRate = 17; // number: integer aur decimal dono
const isStoreOpen = true; // sirf true ya false
const closingNote = null; // jaan-boojh kar "khali"
const couponCode = undefined; // value set hi nahi hui
console.log("--- Topic 4 & 5: Annotations + Primitive types ---");
console.log(storeName, taxRate, isStoreOpen, closingNote, couponCode);
// ------------------------------------------------------------
// TOPIC 6: Arrays
// Syntax: type[]
// ------------------------------------------------------------
const productNames = ["Keyboard", "Mouse", "Headphones"];
const productPrices = [4500, 1500, 3200];
const emptyCart = []; // khali array ki type hamesha likho
emptyCart.push("Keyboard"); // OK: string push ho rahi hai
// reduce / filter / map mein callback ke parameters ki type likhni nahi
// parti, TypeScript array dekh kar khud samajh leta hai (inference).
const totalOfPrices = productPrices.reduce((sum, p) => sum + p, 0);
const expensivePrices = productPrices.filter((p) => p > 2000);
const upperNames = productNames.map((n) => n.toUpperCase());
console.log("--- Topic 6: Arrays ---");
console.log("Total:", totalOfPrices);
console.log("Expensive:", expensivePrices);
console.log("Names:", upperNames);
console.log("Empty cart now:", emptyCart);
// ------------------------------------------------------------
// TOPIC 7: Objects
// Shape: { property: type; property: type }
// ------------------------------------------------------------
const customer = {
    name: "Sara Khan",
    city: "Lahore",
    address: { street: "Gulberg Main Boulevard", country: "Pakistan" },
};
// Objects ki array (cart ka sab se common pattern)
const simpleCart = [
    { title: "Keyboard", price: 4500 },
    { title: "Mouse", price: 1500 },
];
const simpleCartTotal = simpleCart.reduce((sum, item) => sum + item.price, 0);
console.log("--- Topic 7: Objects ---");
console.log(customer.name + " lives in " + customer.city);
console.log("Country:", customer.address.country);
console.log("Cart total:", simpleCartTotal);
// ------------------------------------------------------------
// TOPIC 8: Functions
// Parameters ki type + return type + void + default + callback
// ------------------------------------------------------------
// Normal function
function calculateDiscount(price, percent) {
    return price - (price * percent) / 100;
}
// Arrow function
const formatPrice = (price) => {
    return "Rs. " + price.toFixed(2);
};
// void: function kuch return nahi karta
function logMessage(message) {
    console.log(message);
}
// Default parameter: rate na diya to 17 use hoga
function addTax(price, rate = taxRate) {
    return price + (price * rate) / 100;
}
// Callback: (price: number) => string  ka matlab:
// "aisa function jo number le aur string de"
function applyToPrices(prices, callback) {
    return prices.map(callback);
}
console.log("--- Topic 8: Functions ---");
console.log(calculateDiscount(5000, 10));
console.log(formatPrice(4500));
logMessage("Order #101 is shipped");
console.log(addTax(1000)); // 17% default
console.log(addTax(1000, 5)); // 5% custom
console.log(applyToPrices([1000, 2500], formatPrice));
// ------------------------------------------------------------
// TOPIC 9: Optional properties (aur optional parameters)
// Syntax: propertyName?: type
// ------------------------------------------------------------
function showContact(user) {
    // phone undefined ho sakta hai, isliye ?? se default dete hain
    return user.name + ": " + (user.phone ?? "Phone not provided");
}
// Optional parameter hamesha required parameters ke BAAD aata hai
function greet(name, title) {
    if (title) {
        return "Hello, " + title + " " + name;
    }
    return "Hello, " + name;
}
console.log("--- Topic 9: Optional properties ---");
console.log(showContact({ name: "Ali", phone: "0300-1234567" }));
console.log(showContact({ name: "Sara" }));
console.log(greet("Ali"));
console.log(greet("Ali", "Dr."));
// ------------------------------------------------------------
// TOPIC 10: Union types
// Syntax: typeA | typeB
// ------------------------------------------------------------
let productId = 101;
productId = "P-101"; // OK: dono allowed hain
// Literal union: sirf yeh exact values allowed
let orderStatusInline = "pending";
orderStatusInline = "shipped";
// Narrowing: typeof se check karke andar ki type pakki ho jati hai
function formatId(id) {
    if (typeof id === "string") {
        return id.toUpperCase(); // yahan id string hai
    }
    return "ID-" + id.toFixed(0); // yahan id number hai
}
console.log("--- Topic 10: Union types ---");
console.log("Product id:", productId);
console.log("Status:", orderStatusInline);
console.log(formatId(101));
console.log(formatId("p-2"));
// Interfaces/aliases ke saath typed functions
function getFinalPrice(product) {
    if (product.discount !== undefined) {
        return calculateDiscount(product.price, product.discount);
    }
    return product.price;
}
function getOrderTotal(order) {
    return order.items.reduce((sum, item) => sum + getFinalPrice(item), 0);
}
function updateStatus(order, newStatus) {
    order.status = newStatus;
}
function describeUser(user) {
    return user.name + " (" + user.email + ")";
}
// Data
const products = [
    { id: 1, title: "Keyboard", price: 4500, discount: 10, inStock: true },
    { id: "P-2", title: "Mouse", price: 1500, inStock: true },
    { id: 3, title: "Headphones", price: 3200, discount: 20, inStock: false },
];
const ali = { id: 1, name: "Ali", email: "ali@example.com" };
const admin = {
    id: 2,
    name: "Ali",
    email: "ali@example.com",
    role: "admin",
};
const order = {
    orderId: "ORD-1001",
    customer: ali,
    items: products,
    status: "pending",
    payment: "card",
};
console.log("--- Topic 11 & 12: Type aliases + Interfaces ---");
for (const p of products) {
    console.log(p.title + " -> " + formatPrice(getFinalPrice(p)));
}
console.log("In stock:", products.filter((p) => p.inStock).length);
console.log("Order total:", formatPrice(getOrderTotal(order)));
updateStatus(order, "shipped");
console.log("Order status:", order.status);
// Admin ek User bhi hai, isliye describeUser(admin) chalta hai
console.log(describeUser(admin), "| role:", admin.role);
// ------------------------------------------------------------
// TOPIC 13: Type inference
// Type nahi likhi, TypeScript pehli value se khud samajh leta hai
// ------------------------------------------------------------
let city = "Lahore"; // string infer hui
let itemCount = 3; // number infer hua
const scores = [90, 85, 70]; // number[] infer hua
const scoreTotal = scores.reduce((sum, s) => sum + s, 0);
const average = scoreTotal / scores.length;
city = "Karachi"; // OK: string hi hai
// Return type bhi infer ho jati hai (yahan number)
function double(n) {
    return n * 2;
}
console.log("--- Topic 13: Type inference ---");
console.log(city, itemCount, average.toFixed(1), double(21));
export {};
// ============================================================
// DEBUGGING PRACTICE: In lines ke comments hata kar dekho
// ============================================================
// Har line ko ek ek karke uncomment karo, red line / error dekho,
// phir wapas comment kar do. (Sab ek saath uncomment mat karna.)
//
// let wrong1: number = "500";                   // Topic 4/5: string number mein
// productPrices.push("950");                    // Topic 6: array mein galat type
// customer.nmae;                                // Topic 7: typo
// calculateDiscount(5000);                      // Topic 8: argument kam
// showContact({ phone: "0300" });               // Topic 9: name missing
// orderStatusInline = "cancelled";              // Topic 10: allowed values mein nahi
// const p: Product = { id: 1, title: "X" };     // Topic 11/12: price aur inStock missing
// city = 5;                                     // Topic 13: inference ne string fix ki
