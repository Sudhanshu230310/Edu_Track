-- Add missing Overview and Quiz to all chapters

-- 1. Add missing Overview pages (order_index 0)
INSERT INTO contents (chapter_id, title, body, order_index)
SELECT id, 'Overview', 'An overview of the content covered in this chapter.', 0
FROM chapters
WHERE NOT EXISTS (
  SELECT 1 FROM contents WHERE chapter_id = chapters.id AND title = 'Overview'
);

-- 2. Add missing Quiz pages (order_index 10 - keeping it last)
INSERT INTO contents (chapter_id, title, body, order_index)
SELECT id, 'Quiz', 'A short quiz to test your understanding of the chapter material.', 10
FROM chapters
WHERE NOT EXISTS (
  SELECT 1 FROM contents WHERE chapter_id = chapters.id AND title = 'Quiz'
);
