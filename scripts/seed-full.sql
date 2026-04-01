-- Full seed script for EduTrack Content Analytics Platform

-- 1. Clear existing data to ensure fresh IDs if needed (safe because this is a new setup)
TRUNCATE contents, chapters, books RESTART IDENTITY CASCADE;

-- 2. Insert Books
INSERT INTO books (title, description, cover_url) VALUES 
('Introduction to Computer Science', 'Learn the basics of logic, algorithms, and how computers think.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'),
('Web Development Fundamentals', 'Master HTML, CSS, and JavaScript to build modern websites.', 'https://images.unsplash.com/photo-1547658719-da2b51169166'),
('Data Structures & Algorithms', 'Deep dive into efficient data organization and problem-solving.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea');

-- 3. Insert Chapters for Book 1 (Introduction to Computer Science)
INSERT INTO chapters (book_id, title, order_index) VALUES 
(1, 'Programming Basics', 0),
(1, 'Newton Laws', 1),
(1, 'Algebra Basics', 2);

-- 4. Insert Chapters for Book 2 (Web Development Fundamentals)
INSERT INTO chapters (book_id, title, order_index) VALUES 
(2, 'HTML & CSS', 0),
(2, 'JavaScript Basics', 1);

-- 5. Insert Chapters for Book 3 (Data Structures & Algorithms)
INSERT INTO chapters (book_id, title, order_index) VALUES 
(3, 'Arrays & Lists', 0),
(3, 'Stacks & Queues', 1);

-- 6. Insert Content for Computer Science Chapters
-- Chapter 1 (Programming Basics)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(1, 'Overview', 'Programming is the art and science of giving instructions to a computer to perform specific tasks. At its core, programming involves writing code — a set of human-readable instructions that are translated into machine-readable commands the computer can execute.

Every program, from a simple calculator to a complex video game, is built using a combination of three fundamental building blocks: variables, control structures, and functions. Variables act as containers to store data such as numbers, text, or boolean values. Control structures — like if-else statements and loops — allow the program to make decisions and repeat operations. Functions encapsulate reusable blocks of logic, making code modular and easier to maintain.

Modern programming languages like Python, JavaScript, and Java provide a rich set of tools and libraries that simplify complex tasks. Understanding the basics of how these building blocks work together is the first step toward becoming a proficient developer. In this chapter, you will explore variables, loops, conditionals, and functions with hands-on examples that bring these concepts to life.', NULL, NULL, 0),
(1, 'Video Lesson', 'Watch this video to learn about variables, loops, and functions.', 'https://www.youtube.com/watch?v=lG8f2hFSJzU', 'lG8f2hFSJzU', 1),
(1, 'Practice Problems', '1. Write a loop that prints numbers from 1 to 10.
2. Define a function that takes two numbers and returns their sum.
3. Create a variable to store your name and print a greeting message.
4. Write an if-else statement that checks if a number is even or odd.
5. Combine a loop and a function to calculate the factorial of a number.', NULL, NULL, 2),
(1, 'Quiz', 'Test your knowledge on programming fundamentals.', NULL, NULL, 3);

-- Chapter 2 (Newton Laws)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(2, 'Overview', 'Sir Isaac Newton''s three Laws of Motion, published in 1687 in his groundbreaking work Principia Mathematica, form the foundation of classical mechanics. These laws describe how objects move and interact with forces, and they remain essential to physics and engineering today.

Newton''s First Law, often called the Law of Inertia, states that an object at rest will remain at rest, and an object in motion will continue moving at a constant velocity, unless acted upon by an external force. This explains why passengers in a car lurch forward when brakes are applied suddenly — their bodies tend to maintain the original state of motion.

Newton''s Second Law establishes the relationship between force, mass, and acceleration through the equation F = ma. This law tells us that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. A heavier object requires more force to achieve the same acceleration as a lighter one.

Newton''s Third Law states that for every action, there is an equal and opposite reaction. When you push against a wall, the wall pushes back against you with the same magnitude of force. This principle is fundamental to understanding rocket propulsion and many everyday phenomena.', NULL, NULL, 0),
(2, 'Video Lesson', 'Learn about inertia, force, and relative motion.', 'https://www.youtube.com/watch?v=1XVr4tYb4mA', '1XVr4tYb4mA', 1),
(2, 'Practice Problems', '1. A 5 kg object is pushed with a force of 20 N. Calculate the acceleration using F = ma.
2. Give three real-world examples of Newton''s First Law (inertia).
3. A person pushes a cart with 30 N of force. What is the reaction force?
4. Explain why a ball thrown upward eventually comes back down.
5. Calculate the force needed to accelerate a 1000 kg car at 2 m/s².', NULL, NULL, 2),
(2, 'Quiz', 'Physics quiz on motion laws.', NULL, NULL, 3);

-- Chapter 3 (Algebra Basics)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(3, 'Overview', 'Algebra is a fundamental branch of mathematics that extends arithmetic by introducing variables — symbols (usually letters) that represent unknown or changing quantities. While arithmetic deals with specific numbers, algebra provides the tools to express general relationships and patterns.

At the heart of algebra are expressions and equations. An expression is a mathematical phrase that can contain numbers, variables, and operations (like 3x + 5), while an equation sets two expressions equal to each other (like 3x + 5 = 20). Solving an equation means finding the value of the variable that makes the equation true.

Key algebraic concepts include: coefficients (the numerical part of a term, like the 3 in 3x), constants (fixed values like the 5 in 3x + 5), and operations such as combining like terms and applying the distributive property. These foundational skills are used extensively in science, engineering, economics, and computer science.

Mastering algebra is essential because it develops logical thinking and problem-solving skills that apply far beyond mathematics. Whether you are calculating the trajectory of a spacecraft or balancing a budget, algebraic thinking provides the framework for structured reasoning.', NULL, NULL, 0),
(3, 'Video Lesson', 'Solving for x and simplifying expressions.', 'https://www.youtube.com/watch?v=yPYe8CnR-oM', 'yPYe8CnR-oM', 1),
(3, 'Practice Problems', '1. Solve for x: x + 5 = 12
2. Simplify the expression: 3x - 2x + 7x
3. Solve: 2x - 4 = 10
4. If y = 3x + 2, find y when x = 4.
5. Expand: 2(x + 3) and simplify.', NULL, NULL, 2),
(3, 'Quiz', 'Algebraic reasoning quiz.', NULL, NULL, 3);

-- 7. Insert Content for Web Dev Chapters
-- Chapter 4 (HTML & CSS)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(4, 'Overview', 'HTML (HyperText Markup Language) and CSS (Cascading Style Sheets) are the twin pillars of web development. HTML provides the structural foundation of a webpage — defining elements like headings, paragraphs, images, links, and forms — while CSS controls the visual presentation, including colors, fonts, spacing, and layout.

Every webpage you visit is built using HTML. The language uses a system of tags (like <h1>, <p>, <img>, <a>) to organize content into a hierarchical structure known as the Document Object Model (DOM). Browsers read this structure and render the content visually. HTML5, the latest version, introduces semantic elements like <header>, <nav>, <main>, and <footer> that improve both accessibility and search engine optimization.

CSS transforms plain HTML into visually appealing designs. Using selectors, properties, and values, CSS allows developers to target specific elements and apply styles. Modern CSS features like Flexbox and Grid provide powerful layout systems that make responsive design — adapting layouts to different screen sizes — straightforward and intuitive.

Together, HTML and CSS form the essential skill set for any aspiring web developer. Understanding how these two technologies work together is the critical first step before moving on to JavaScript and more advanced frameworks.', NULL, NULL, 0),
(4, 'Video Lesson', 'Building your first webpage.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1),
(4, 'Practice Problems', '1. Create an HTML page with a heading, a paragraph, and an image.
2. Style the heading with a custom font color and size using CSS.
3. Build a simple navigation bar using an unordered list.
4. Use Flexbox to center a div both horizontally and vertically.
5. Create a responsive layout that switches from two columns to one on mobile.', NULL, NULL, 2),
(4, 'Quiz', 'HTML and CSS fundamentals quiz.', NULL, NULL, 3);

-- Chapter 5 (JavaScript Basics)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(5, 'Overview', 'JavaScript is the programming language of the web. While HTML provides structure and CSS provides style, JavaScript brings interactivity and dynamic behavior to web pages. It is the only programming language that runs natively in web browsers, making it an indispensable tool for frontend development.

JavaScript allows developers to respond to user actions — clicks, keystrokes, form submissions — and update the page content without requiring a full reload. This is achieved through the Document Object Model (DOM) API, which lets JavaScript access and manipulate HTML elements in real time. Modern JavaScript (ES6+) introduces powerful features like arrow functions, template literals, destructuring, and modules that make code cleaner and more maintainable.

Beyond the browser, JavaScript has expanded to server-side development through Node.js, enabling full-stack development with a single language. Popular frameworks and libraries like React, Vue, and Angular build on JavaScript to create sophisticated user interfaces. Understanding core JavaScript concepts — variables (let, const), data types, functions, arrays, objects, and control flow — is essential before diving into any framework.

Whether you are building a simple interactive form or a complex single-page application, JavaScript is the engine that powers the modern web experience.', NULL, NULL, 0),
(5, 'Video Lesson', 'JavaScript essentials for beginners.', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'W6NZfCO5SIk', 1),
(5, 'Practice Problems', '1. Declare variables using let and const and explain the difference.
2. Write a function that takes a name and returns a greeting string.
3. Create an array of 5 fruits and use a loop to print each one.
4. Write an event listener that changes a button''s color when clicked.
5. Use template literals to build a multi-line string with embedded variables.', NULL, NULL, 2),
(5, 'Quiz', 'JavaScript fundamentals quiz.', NULL, NULL, 3);

-- 8. Insert Content for Data Structures Chapters
-- Chapter 6 (Arrays & Lists)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(6, 'Overview', 'Arrays are one of the most fundamental and widely used data structures in computer science. An array is an ordered collection of elements stored in contiguous memory locations, where each element can be accessed directly by its index — a numerical position starting from 0.

The power of arrays lies in their simplicity and efficiency. Accessing any element by its index is an O(1) operation — it takes constant time regardless of the array''s size. This makes arrays ideal for situations where you need fast, random access to elements. Common operations include traversing (visiting every element), searching (finding a specific value), inserting, and deleting elements.

However, arrays also have limitations. In many languages, arrays have a fixed size that must be declared at creation time. Inserting or deleting elements in the middle requires shifting subsequent elements, which is an O(n) operation. Dynamic arrays (like JavaScript arrays or Python lists) overcome the fixed-size limitation by automatically resizing, but the shifting cost remains.

Understanding arrays is crucial because they serve as the building block for more complex data structures like stacks, queues, hash tables, and heaps. Mastering array manipulation — sorting, filtering, mapping, and reducing — will dramatically improve your problem-solving skills and prepare you for coding interviews.', NULL, NULL, 0),
(6, 'Video Lesson', 'Introduction to Arrays.', 'https://www.youtube.com/watch?v=bum_19loj9A', 'bum_19loj9A', 1),
(6, 'Practice Problems', '1. Create an array of 10 integers and find the maximum value.
2. Write a function to reverse an array in place.
3. Remove duplicates from an array without using a Set.
4. Merge two sorted arrays into a single sorted array.
5. Implement a linear search and a binary search on a sorted array.', NULL, NULL, 2),
(6, 'Quiz', 'Arrays and lists quiz.', NULL, NULL, 3);

-- Chapter 7 (Stacks & Queues)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(7, 'Overview', 'Stacks and Queues are two fundamental abstract data types that manage collections of elements with specific ordering rules. Despite their simplicity, they are used extensively in algorithms, operating systems, and application design.

A Stack operates on the Last-In, First-Out (LIFO) principle — the last element added is the first one removed. Think of it like a stack of plates: you can only add or remove plates from the top. The two primary operations are push (add to top) and pop (remove from top). Stacks are used in function call management (the call stack), undo/redo functionality in editors, expression evaluation, and backtracking algorithms like depth-first search.

A Queue operates on the First-In, First-Out (FIFO) principle — the first element added is the first one removed. Like a line of people waiting at a ticket counter, the person who arrives first gets served first. The primary operations are enqueue (add to rear) and dequeue (remove from front). Queues are essential in breadth-first search, print spooling, task scheduling in operating systems, and handling asynchronous events.

Variations like Priority Queues (where elements are dequeued based on priority rather than order), Double-ended Queues (Deques, allowing insertion and removal at both ends), and Circular Queues (efficient use of array space) extend the basic concepts. Understanding when and why to use a stack versus a queue is a critical skill in algorithm design and software engineering.', NULL, NULL, 0),
(7, 'Video Lesson', 'Understanding Stacks and Queues.', 'https://www.youtube.com/watch?v=wjI1WNcIntg', 'wjI1WNcIntg', 1),
(7, 'Practice Problems', '1. Implement a Stack using an array with push, pop, and peek operations.
2. Implement a Queue using an array with enqueue, dequeue, and front operations.
3. Use a stack to check if a string of parentheses is balanced.
4. Simulate a print queue: add 5 jobs and process them in FIFO order.
5. Implement a function that reverses a string using a stack.', NULL, NULL, 2),
(7, 'Quiz', 'Stacks and queues quiz.', NULL, NULL, 3);
