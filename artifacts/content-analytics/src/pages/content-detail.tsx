import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { useGetContent, getGetContentQueryKey, useTrackButtonClick, useGetBook, getGetBookQueryKey } from "@workspace/api-client-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrCreateUserId } from "@/lib/user";
import { apiFetch, isLoggedIn } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const contentId = Number(id);
  const { data: content, isLoading } = useGetContent(contentId, { query: { enabled: !!contentId, queryKey: getGetContentQueryKey(contentId) } });
  
  const { data: book } = useGetBook(content?.book_id || 0, { query: { enabled: !!content?.book_id, queryKey: getGetBookQueryKey(content?.book_id || 0) } });
  
  const userId = getOrCreateUserId();
  const trackButtonClick = useTrackButtonClick();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompletingLoading, setIsCompletingLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestionsByChapter: Record<string, { question: string; options: string[]; answer: number }[]> = {
    "Programming Basics": [
      { question: "What is the primary purpose of a variable?", options: ["To repeat a task", "To store information for later use", "To make a decision in code"], answer: 1 },
      { question: "Which control structure is used to repeat a block of code multiple times?", options: ["Variable", "Function", "Loop"], answer: 2 },
      { question: "What is a 'function' in programming?", options: ["A reusable block of code", "A mathematical equation", "A way to print text"], answer: 0 },
    ],
    "Newton Laws": [
      { question: "Newton's First Law is also known as the Law of:", options: ["Motion", "Inertia", "Gravity"], answer: 1 },
      { question: "In the formula F = ma, what does 'a' represent?", options: ["Area", "Acceleration", "Altitude"], answer: 1 },
      { question: "Newton's Third Law states that for every action, there is an:", options: ["Equal and opposite reaction", "Increase in speed", "Upward force"], answer: 0 },
    ],
    "Algebra Basics": [
      { question: "Solve for x: x + 7 = 15", options: ["22", "8", "5"], answer: 1 },
      { question: "Simplify the expression: 3x + 4x - 2x", options: ["5x", "7x", "9x"], answer: 0 },
      { question: "In the term '5y', what is the number 5 called?", options: ["Variable", "Constant", "Coefficient"], answer: 2 },
    ],
    "HTML & CSS": [
      { question: "Which HTML tag is used for the largest heading?", options: ["<head>", "<h1>", "<header>"], answer: 1 },
      { question: "Which CSS property is used to change text color?", options: ["font-color", "color", "text-style"], answer: 1 },
      { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], answer: 1 },
    ],
    "JavaScript Basics": [
      { question: "Which keyword is used to declare a constant variable?", options: ["var", "let", "const"], answer: 2 },
      { question: "What is the purpose of console.log()?", options: ["Create a popup", "Print to the developer console", "Stop the script"], answer: 1 },
      { question: "Which operator is used for assignment?", options: ["=", "==", "==="], answer: 0 },
    ],
    "Arrays & Lists": [
      { question: "What is the index of the first element in an array?", options: ["1", "0", "-1"], answer: 1 },
      { question: "How do you find the length of an array in JavaScript?", options: [".count", ".size", ".length"], answer: 2 },
      { question: "Adding an element to the end of an array is called:", options: ["slice", "push", "shift"], answer: 1 },
    ],
    "Stacks & Queues": [
      { question: "Which principle does a Stack follow?", options: ["FIFO", "LIFO", "LILO"], answer: 1 },
      { question: "Which operation removes an item from a Stack?", options: ["pop", "shift", "dequeue"], answer: 0 },
      { question: "What is a real-world example of a Queue?", options: ["A stack of trays", "People in line at a store", "A pile of books"], answer: 1 },
    ],
  };

  const quizQuestions = content?.title === "Quiz" ? quizQuestionsByChapter[content.chapter_title] : undefined;
  const quizContent = book?.chapters.flatMap(c => c.contents).find(cnt => cnt.chapter_id === content?.chapter_id && cnt.title === "Quiz");

  useEffect(() => {
    if (!contentId || !isLoggedIn()) return;
    apiFetch<{ progress: Array<{ content_id: number }> }>("/api/progress")
      .then(data => {
        setIsCompleted(data.progress.some(p => p.content_id === contentId));
      })
      .catch(() => {});
  }, [contentId]);

  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [content?.id]);

  // Tracking state
  const maxScrollRef = useRef(0);
  const playerRef = useRef<any>(null);
  const watchTimerRef = useRef<number | null>(null);
  const totalWatchedSecondsRef = useRef(0);
  const lastUpdateSecondsRef = useRef(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollHeight > 0 ? Math.round((window.scrollY / scrollHeight) * 100) : 100;
      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // YouTube IFrame setup
  useEffect(() => {
    if (!content?.video_id) return;
    
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(`youtube-player-${content.video_id}`, {
          events: {
            onStateChange: onPlayerStateChange
          }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      stopWatchTimer();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [content?.video_id]);

  const reportVideoWatch = (seconds: number) => {
    if (seconds <= 0 || !content?.video_id) return;
    navigator.sendBeacon('/api/analytics/video-watch', new Blob([JSON.stringify({
      user_id: userId,
      video_id: content.video_id,
      content_id: contentId,
      watched_seconds: seconds
    })], { type: 'application/json' }));
  };

  const startWatchTimer = () => {
    if (watchTimerRef.current) return;
    watchTimerRef.current = window.setInterval(() => {
      totalWatchedSecondsRef.current += 1;
      if (totalWatchedSecondsRef.current - lastUpdateSecondsRef.current >= 30) {
        const diff = totalWatchedSecondsRef.current - lastUpdateSecondsRef.current;
        reportVideoWatch(diff);
        lastUpdateSecondsRef.current = totalWatchedSecondsRef.current;
      }
    }, 1000);
  };

  const stopWatchTimer = () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
      watchTimerRef.current = null;
      const diff = totalWatchedSecondsRef.current - lastUpdateSecondsRef.current;
      if (diff > 0) {
        reportVideoWatch(diff);
        lastUpdateSecondsRef.current = totalWatchedSecondsRef.current;
      }
    }
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === 1) {
      startWatchTimer();
    } else if (event.data === 2 || event.data === 0) {
      stopWatchTimer();
    }
  };

  // Unload Beacon for scroll
  useEffect(() => {
    const handleUnload = () => {
      stopWatchTimer();
      if (maxScrollRef.current > 0) {
        navigator.sendBeacon('/api/analytics/scroll-depth', new Blob([JSON.stringify({
          user_id: userId,
          content_id: contentId,
          max_scroll_percent: maxScrollRef.current
        })], { type: 'application/json' }));
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [contentId, userId]);

  const handleButtonClick = (label: string) => {
    trackButtonClick.mutate({ data: { user_id: userId, button_label: label, content_id: contentId } });
  };

  const handleTakeQuiz = () => {
    if (quizContent && content?.title !== "Quiz") {
      window.location.href = `/content/${quizContent.id}`;
      return;
    }
    handleButtonClick('take_quiz');
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const quizScore = quizQuestions ? quizQuestions.reduce((score, question, index) => {
    if (selectedAnswers[index] === question.answer) return score + 1;
    return score;
  }, 0) : 0;

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    handleButtonClick('submit_quiz');
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const quizButtonLabel = content?.title === 'Quiz'
    ? 'Take Quiz'
    : quizContent
      ? 'Open Quiz'
      : 'Take Quiz';

  const handleMarkComplete = async () => {
    if (isCompletingLoading) return;
    setIsCompletingLoading(true);
    try {
      if (isCompleted) {
        await apiFetch("/api/progress/complete", { method: "DELETE", body: JSON.stringify({ content_id: contentId }) });
        setIsCompleted(false);
      } else {
        await apiFetch("/api/progress/complete", { method: "POST", body: JSON.stringify({ content_id: contentId }) });
        setIsCompleted(true);
        handleButtonClick('mark_complete');
      }
    } catch {
      // silently fail — analytics still tracked
    } finally {
      setIsCompletingLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-[1200px] mx-auto"><Skeleton className="h-[600px] w-full rounded-2xl" /></div>;
  }

  if (!content) return <div className="text-center py-12">Content not found</div>;

  let prevContent = null;
  let nextContent = null;

  if (book && content) {
    const sortedChapters = [...book.chapters].sort((a, b) => a.order_index - b.order_index);
    const sortedChapterContents = sortedChapters.map(chapter => ({
      ...chapter,
      contents: [...chapter.contents].sort((a, b) => a.order_index - b.order_index),
    }));

    const chapterIndex = sortedChapterContents.findIndex(chapter => chapter.id === content.chapter_id);
    if (chapterIndex >= 0) {
      const chapter = sortedChapterContents[chapterIndex];
      const contentIndex = chapter.contents.findIndex(cnt => cnt.id === content.id);

      if (contentIndex >= 0) {
        if (contentIndex > 0) {
          prevContent = chapter.contents[contentIndex - 1];
        } else if (chapterIndex > 0) {
          const previousChapter = sortedChapterContents[chapterIndex - 1];
          prevContent = previousChapter.contents[previousChapter.contents.length - 1];
        }

        if (contentIndex < chapter.contents.length - 1) {
          nextContent = chapter.contents[contentIndex + 1];
        } else if (chapterIndex < sortedChapterContents.length - 1) {
          const nextChapter = sortedChapterContents[chapterIndex + 1];
          nextContent = nextChapter.contents[0];
        }
      }
    }
  }

  return (
    <div style={{maxWidth: 1200, margin: '0 auto', paddingBottom: 64}}>
      <div style={{display: 'grid', gridTemplateColumns: '65% 35%', gap: 32, alignItems: 'start'}}>
        {/* Left column */}
        <div>
          <Breadcrumb style={{marginBottom: 24}}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/books/${content.book_id}`} style={{color: '#636E72', fontWeight: 500}}>{content.book_title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span style={{color: '#636E72', fontWeight: 500}}>{content.chapter_title}</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage style={{color: '#2D3436', fontWeight: 600}}>{content.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {content.video_url && content.video_id && (
            <div style={{aspectRatio: '16/9', background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
              <iframe
                id={`youtube-player-${content.video_id}`}
                style={{width: '100%', height: '100%'}}
                src={`https://www.youtube.com/embed/${content.video_id}?enablejsapi=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {content.title !== "Quiz" && (
            <h1 style={{fontSize: 24, fontWeight: 700, color: '#2D3436', marginTop: 24, marginBottom: 16}}>{content.title}</h1>
          )}
          
          {content.body && content.title !== "Quiz" && (
            <div style={{fontSize: 16, lineHeight: 1.8, color: '#2D3436', whiteSpace: 'pre-line'}}>
              {content.body.split('\n\n').map((p, i) => (
                <p key={i} style={{marginBottom: 16}}>{p}</p>
              ))}
            </div>
          )}

          {quizQuestions && (
            <div style={{marginTop: 40, padding: 32, borderRadius: 24, background: '#FFFFFF', border: '1px solid #E8EAED', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
                <div>
                  <h2 style={{fontSize: 24, fontWeight: 700, color: '#2D3436', marginBottom: 4}}>{content.title === "Quiz" ? "Quiz" : "Knowledge Check"}</h2>
                  <p style={{color: '#636E72', fontSize: 14}}>Select the best answer for each question below.</p>
                </div>
                {quizSubmitted && (
                  <div style={{
                    padding: '8px 16px', borderRadius: 12, 
                    background: quizScore === quizQuestions.length ? '#E8F8F1' : '#F4F5FA',
                    border: `1px solid ${quizScore === quizQuestions.length ? '#00B894' : '#DDE1E7'}`
                  }}>
                    <span style={{fontWeight: 700, color: quizScore === quizQuestions.length ? '#00B894' : '#2D3436', fontSize: 18}}>
                      {`Score: ${quizScore} / ${quizQuestions.length}`}
                    </span>
                  </div>
                )}
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                {quizQuestions.map((question, qIndex) => (
                  <div key={qIndex}>
                    <p style={{marginBottom: 16, fontSize: 17, fontWeight: 600, color: '#2D3436'}}>{`${qIndex + 1}. ${question.question}`}</p>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                      {question.options.map((option, optionIndex) => {
                        const selected = selectedAnswers[qIndex] === optionIndex;
                        const isCorrect = quizSubmitted && question.answer === optionIndex;
                        const isWrong = quizSubmitted && selected && question.answer !== optionIndex;
                        
                        let borderColor = '#DDE1E7';
                        let bgColor = '#FFFFFF';
                        let textColor = '#2D3436';
                        
                        if (isCorrect) {
                          borderColor = '#00B894';
                          bgColor = '#E8F8F1';
                        } else if (isWrong) {
                          borderColor = '#FE5F55';
                          bgColor = '#FFF0F0';
                        } else if (selected) {
                          borderColor = '#6C5CE7';
                          bgColor = '#F0EFFF';
                        }

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleSelectAnswer(qIndex, optionIndex)}
                            disabled={quizSubmitted}
                            style={{
                              textAlign: 'left', padding: '16px 20px', borderRadius: 14,
                              border: `2px solid ${borderColor}`,
                              background: bgColor,
                              color: textColor, 
                              cursor: quizSubmitted ? 'default' : 'pointer',
                              transition: 'all 0.2s',
                              fontWeight: selected ? 600 : 500,
                              fontSize: 15,
                              boxShadow: selected ? '0 4px 12px rgba(108, 92, 231, 0.1)' : 'none'
                            }}
                          >
                            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%', 
                                border: `2px solid ${selected ? borderColor : '#DDE1E7'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: selected ? borderColor : 'transparent',
                                flexShrink: 0
                              }}>
                                {selected && <div style={{width: 8, height: 8, borderRadius: '50%', background: '#FFF'}} />}
                              </div>
                              {option}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop: 40, paddingTop: 24, borderTop: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', gap: 16}}>
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                    style={{
                      padding: '14px 28px', borderRadius: 12, border: 'none', 
                      background: '#6C5CE7', color: '#FFFFFF', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                      opacity: Object.keys(selectedAnswers).length < quizQuestions.length ? 0.5 : 1,
                      transform: 'scale(1)',
                    }}
                    onMouseEnter={e => { if (Object.keys(selectedAnswers).length === quizQuestions.length) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', 
                        background: quizScore === quizQuestions.length ? '#00B894' : '#6C5CE7',
                        color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                      }}>
                        {quizScore === quizQuestions.length ? "✨" : "📚"}
                      </div>
                      <div>
                        <div style={{fontWeight: 700, color: '#2D3436'}}>
                          {quizScore === quizQuestions.length ? "Excellent Work!" : "Good Try!"}
                        </div>
                        <div style={{fontSize: 14, color: '#636E72'}}>
                          {quizScore === quizQuestions.length 
                            ? "You mastered this chapter perfectly." 
                            : `You got ${quizScore} out of ${quizQuestions.length} correct.`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleResetQuiz}
                      style={{
                        padding: '12px 20px', borderRadius: 12, border: '1px solid #DDE1E7',
                        background: '#FFFFFF', color: '#2D3436', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      Retry Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 48, paddingTop: 24, borderTop: '1px solid #E8EAED'}}>
            {prevContent ? (
              <Link href={`/content/${prevContent.id}`} style={{display: 'flex', flexDirection: 'column', gap: 4, textDecoration: 'none'}}>
                <span style={{color: '#636E72', fontSize: 12, fontWeight: 600, textTransform: 'uppercase'}}>← PREVIOUS</span>
                <span style={{color: '#6C5CE7', fontSize: 16, fontWeight: 600}}>{prevContent.title}</span>
              </Link>
            ) : (
              <Link href={`/books/${content.book_id}`} style={{color: '#636E72', fontSize: 14, fontWeight: 500, textDecoration: 'none'}}>
                ← Back to Book
              </Link>
            )}
            
            {nextContent ? (
              <Link href={`/content/${nextContent.id}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, textDecoration: 'none'}}>
                <span style={{color: '#636E72', fontSize: 12, fontWeight: 600, textTransform: 'uppercase'}}>NEXT →</span>
                <span style={{color: '#6C5CE7', fontSize: 16, fontWeight: 600}}>{nextContent.title}</span>
              </Link>
            ) : (
              <span style={{color: '#636E72', fontSize: 14, fontWeight: 500}}>End of Chapter</span>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 96}}>
          {/* Actions card */}
          <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{fontWeight: 600, fontSize: 16, color: '#2D3436', marginBottom: 16}}>Lesson Actions</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <button
                onClick={handleMarkComplete}
                data-testid="button-mark-complete"
                disabled={isCompletingLoading}
                style={{
                  width: '100%', height: 48, fontWeight: 600, borderRadius: 12, border: 'none',
                  cursor: isCompletingLoading ? 'not-allowed' : 'pointer', fontSize: 14, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: isCompleted ? '#00B894' : '#6C5CE7',
                  color: '#FFFFFF',
                  opacity: isCompletingLoading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!isCompletingLoading) e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { if (!isCompletingLoading) e.currentTarget.style.opacity = '1'; }}
              >
                <CheckCircle2 size={16} />
                {isCompletingLoading ? "Saving..." : isCompleted ? "Completed!" : "Mark as Complete"}
              </button>
              <button 
                onClick={handleTakeQuiz} 
                data-testid="button-take-quiz"
                style={{width: '100%', height: 48, background: 'transparent', color: '#6C5CE7', fontWeight: 600, borderRadius: 12, border: '2px solid #6C5CE7', cursor: 'pointer', fontSize: 14, transition: 'background 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(108, 92, 231, 0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {quizButtonLabel}
              </button>
              <button 
                onClick={() => handleButtonClick('download_notes')} 
                data-testid="button-download-notes"
                style={{width: '100%', height: 48, background: '#F4F5FA', color: '#636E72', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, transition: 'background 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.background = '#E8EAED'}
                onMouseLeave={e => e.currentTarget.style.background = '#F4F5FA'}
              >
                Download Notes
              </button>
            </div>
          </div>

          {/* About card */}
          <div style={{background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <h3 style={{fontWeight: 600, fontSize: 16, color: '#2D3436', marginBottom: 12}}>About this lesson</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <div>
                <span style={{color: '#636E72', fontSize: 12, textTransform: 'uppercase', fontWeight: 600}}>Course</span>
                <div style={{color: '#2D3436', fontSize: 14, fontWeight: 500, marginTop: 2}}>{content.book_title}</div>
              </div>
              <div style={{marginTop: 8}}>
                <span style={{color: '#636E72', fontSize: 12, textTransform: 'uppercase', fontWeight: 600}}>Chapter</span>
                <div style={{color: '#2D3436', fontSize: 14, fontWeight: 500, marginTop: 2}}>{content.chapter_title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
