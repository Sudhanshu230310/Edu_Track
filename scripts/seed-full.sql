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
(1, 'Newton Laws', 1), -- Mixing physics as per seed-content-pages-v2.sql
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
(1, 'Overview', 'Programming is the process of creating a set of instructions that tell a computer how to perform tasks.', NULL, NULL, 0),
(1, 'Video Lesson', 'Watch this video to learn about variables, loops, and functions.', 'https://www.youtube.com/watch?v=lG8f2hFSJzU', 'lG8f2hFSJzU', 1),
(1, 'Practice Problems', '1. Write a loop to print 1 to 5.\n2. Define a function.', NULL, NULL, 2),
(1, 'Quiz', 'Test your knowledge on programming fundamentals.', NULL, NULL, 3);

-- Chapter 2 (Newton Laws)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(2, 'Overview', 'Newton’s Laws of Motion describe how objects move and respond to forces.', NULL, NULL, 0),
(2, 'Video Lesson', 'Learn about inertia, force, and relative motion.', 'https://www.youtube.com/watch?v=1XVr4tYb4mA', '1XVr4tYb4mA', 1),
(2, 'Practice Problems', '1. F = ma calculation.\n2. Example of reaction force.', NULL, NULL, 2),
(2, 'Quiz', 'Physics quiz on motion laws.', NULL, NULL, 3);

-- Chapter 3 (Algebra Basics)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(3, 'Overview', 'Algebra introduces variables and the structure of equations.', NULL, NULL, 0),
(3, 'Video Lesson', 'Solving for x and simplifying expressions.', 'https://www.youtube.com/watch?v=yPYe8CnR-oM', 'yPYe8CnR-oM', 1),
(3, 'Practice Problems', '1. Solve x + 5 = 12.\n2. Simplify 3x - 2x.', NULL, NULL, 2),
(3, 'Quiz', 'Algebraic reasoning quiz.', NULL, NULL, 3);

-- 7. Insert Content for Web Dev Chapters
-- Chapter 4 (HTML & CSS)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(4, 'Overview', 'HTML provides structure, while CSS provides styling for web pages.', NULL, NULL, 0),
(4, 'Video Lesson', 'Building your first webpage.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1);

-- 8. Insert Content for Data Structures Chapters
-- Chapter 6 (Arrays & Lists)
INSERT INTO contents (chapter_id, title, body, video_url, video_id, order_index) VALUES 
(5, 'Overview', 'Arrays are fundamental data structures that store elements in sequence.', NULL, NULL, 0),
(5, 'Video Lesson', 'Introduction to Arrays.', 'https://www.youtube.com/watch?v=bum_19loj9A', 'bum_19loj9A', 1);
