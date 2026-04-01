-- Elaborate Chapter Overviews into Full Paragraphs

-- 1. Programming Basics
UPDATE contents SET body = 'Programming is the art and science of instructing computers to perform specific tasks. It involves writing logic using structured languages like JavaScript or Python. By understanding variables, loops, and functions, developers can build everything from simple websites to complex artificial intelligence systems. This chapter provides a foundational understanding of these core concepts and prepares you for more advanced software development.'
WHERE chapter_id = 1 AND title = 'Overview';

-- 2. Newton Laws
UPDATE contents SET body = 'Newton’s Laws of Motion describe how objects move and respond to forces, forming the backbone of classical mechanics. From the inertia of stationary objects to the acceleration of propelled ones, these three laws explain the physical interactions that define our universe. This chapter explores each law with practical examples and the famous equation F = ma, providing a deep dive into the physics of everyday life.'
WHERE chapter_id = 2 AND title = 'Overview';

-- 3. Algebra Basics
UPDATE contents SET body = 'Algebra introduces the use of variables to represent unknown numbers and defines the structure of equations. By learning how to balance and solve for variables like x, you build the problem-solving skills necessary for higher mathematics and real-world data analysis. This chapter covers the basics of arithmetic operations within algebraic expressions and teaches you how to simplify complex problems into solvable steps.'
WHERE chapter_id = 3 AND title = 'Overview';

-- 4. HTML & CSS
UPDATE contents SET body = 'HTML (HyperText Markup Language) provides the fundamental structure of every web page, while CSS (Cascading Style Sheets) controls its visual presentation. Together, they form the "skeleton" and "skin" of the web. This chapter teaches you how to organize content with tags and style it with properties to create stunning, responsive websites that look great on any device, from phones to desktop monitors.'
WHERE chapter_id = 4 AND title = 'Overview';

-- 5. JavaScript Basics
UPDATE contents SET body = 'JavaScript is the language of the web, enabling interactivity and dynamic behavior in the browser. Beyond simple buttons and forms, it allows developers to manipulate data, handle user events, and build complex single-page applications. This chapter dives into the basic syntax, variables, and common operations that make JavaScript a powerful and essential tool for modern front-end and back-end development.'
WHERE chapter_id = 5 AND title = 'Overview';

-- 6. Arrays & Lists
UPDATE contents SET body = 'Arrays are fundamental data structures that store elements in a sequence, allowing for efficient access and organization. Whether you''re managing a list of users or a set of game items, understanding how to index and manipulate arrays is crucial for any programmer. This chapter covers indexing, traversal, and common array methods that form the basis of data management in software engineering.'
WHERE chapter_id = 6 AND title = 'Overview';

-- 7. Stacks & Queues
UPDATE contents SET body = 'Stacks and Queues are abstract data types that manage data in specific orders: LIFO (Last In, First Out) and FIFO (First In, First Out). These structures are essential for managing function calls, Undo/Redo history, and task scheduling in operating systems. This chapter demonstrates their primary operations—push, pop, enqueue, and dequeue—and explores their real-world applications in computer science.'
WHERE chapter_id = 7 AND title = 'Overview';
