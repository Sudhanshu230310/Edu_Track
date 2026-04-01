-- Update Quiz Content with Topic-Specific Questions

-- 1. Programming Basics
UPDATE contents SET body = E'### Quiz: Programming Basics\n\n1. What is the primary purpose of a variable?\n   - A) To repeat a task\n   - B) To store information for later use\n   - C) To make a decision in code\n\n2. Which control structure is used to repeat a block of code multiple times?\n   - A) Variable\n   - B) Function\n   - C) Loop\n\n3. What is a "function" in programming?\n   - A) A reusable block of code that performs a specific task\n   - B) A type of mathematical equation\n   - C) A way to print text to the screen'
WHERE chapter_id = 1 AND title = 'Quiz';

-- 2. Newton Laws
UPDATE contents SET body = E'### Quiz: Newton Laws of Motion\n\n1. What is Newton''s First Law, also known as the Law of Inertia?\n   - A) Force equals mass times acceleration\n   - B) For every action, there is an equal and opposite reaction\n   - C) An object at rest stays at rest unless acted upon by a force\n\n2. In the formula F = ma, what does "a" represent?\n   - A) Area\n   - B) Acceleration\n   - C) Altitude\n\n3. Newton''s Third Law states that for every action, there is an...?\n   - A) Equal and opposite reaction\n   - B) Increase in speed\n   - C) Upward force'
WHERE chapter_id = 2 AND title = 'Quiz';

-- 3. Algebra Basics
UPDATE contents SET body = E'### Quiz: Algebra Fundamentals\n\n1. Solve for x: x + 7 = 15\n   - A) 22\n   - B) 8\n   - C) 5\n\n2. Combine the like terms: 3x + 4x - 2x\n   - A) 5x\n   - B) 7x\n   - C) 9x\n\n3. In the expression "5y", what is the term for the number 5?\n   - A) Variable\n   - B) Constant\n   - C) Coefficient'
WHERE chapter_id = 3 AND title = 'Quiz';

-- 4. HTML & CSS
UPDATE contents SET body = E'### Quiz: HTML & CSS Basics\n\n1. Which HTML tag is used to define the largest heading?\n   - A) <head>\n   - B) <h1>\n   - C) <header>\n\n2. Which CSS property is used to change the color of text?\n   - A) font-color\n   - B) color\n   - C) text-style\n\n3. What does CSS stand for?\n   - A) Creative Style Sheets\n   - B) Computer Style Sheets\n   - C) Cascading Style Sheets'
WHERE chapter_id = 4 AND title = 'Quiz';

-- 5. JavaScript Basics
UPDATE contents SET body = E'### Quiz: JavaScript Essentials\n\n1. Which keyword is used to declare a variable that should not change?\n   - A) var\n   - B) let\n   - C) const\n\n2. What does the `console.log()` function do?\n   - A) It creates a popup window\n   - B) It prints information to the developer console\n   - C) It stops the script from running\n\n3. Which operator is used for assignment in JavaScript?\n   - A) =\n   - B) ==\n   - C) ==='
WHERE chapter_id = 5 AND title = 'Quiz';

-- 6. Arrays & Lists
UPDATE contents SET body = E'### Quiz: Arrays & Lists\n\n1. What is the index of the first element in a standard array?\n   - A) 1\n   - B) 0\n   - C) -1\n\n2. How do you find the number of elements in an array in JavaScript?\n   - A) .count\n   - B) .size\n   - C) .length\n\n3. What is the term for adding an element to the end of an array?\n   - A) slice\n   - B) push\n   - C) shift'
WHERE chapter_id = 6 AND title = 'Quiz';

-- 7. Stacks & Queues
UPDATE contents SET body = E'### Quiz: Stacks & Queues\n\n1. Which principle does a Stack data structure follow?\n   - A) FIFO (First In First Out)\n   - B) LIFO (Last In First Out)\n   - C) LILO (Last In Last Out)\n\n2. What is the primary operation used to remove an item from a Stack?\n   - A) pop\n   - B) shift\n   - C) dequeue\n\n3. Which real-world example best represents a Queue?\n   - A) A stack of cafeteria trays\n   - B) People waiting in line at a grocery store\n   - C) A pile of books'
WHERE chapter_id = 7 AND title = 'Quiz';
