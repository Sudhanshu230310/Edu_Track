import { useGetBook, getGetBookQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const { data: book, isLoading } = useGetBook(bookId, { query: { enabled: !!bookId, queryKey: getGetBookQueryKey(bookId) } });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto"><Skeleton className="h-[600px] w-full rounded-2xl" /></div>;
  }

  if (!book) return <div className="max-w-4xl mx-auto text-center py-12">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" style={{color: '#636E72', fontWeight: 500}}>Library</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage style={{color: '#2D3436', fontWeight: 600}}>{book.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <h1 style={{fontSize: 28, fontWeight: 700, color: '#2D3436'}}>{book.title}</h1>
        {book.description && <p style={{color: '#636E72', fontSize: 16, lineHeight: 1.6}}>{book.description}</p>}
      </div>

      <div className="pt-4">
        <Accordion type="multiple" defaultValue={book.chapters.map(c => c.id.toString())} className="w-full space-y-4">
          {book.chapters.sort((a, b) => a.order_index - b.order_index).map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id.toString()} style={{border: 'none', background: '#FFFFFF', borderRadius: 16, padding: '8px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'}}>
              <AccordionTrigger className="hover:no-underline py-4" style={{borderBottom: 'none'}}>
                <div style={{display: 'flex', alignItems: 'center', textAlign: 'left'}}>
                  <span style={{background: 'rgba(108, 92, 231, 0.1)', color: '#6C5CE7', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, marginRight: 16}}>
                    Ch {(chapter.order_index + 1).toString().padStart(2, '0')}
                  </span>
                  <span style={{fontSize: 16, fontWeight: 500, color: '#2D3436'}}>{chapter.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  {chapter.contents.sort((a, b) => a.order_index - b.order_index).map((content) => (
                    <div key={content.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F4F5FA', borderRadius: 12}}>
                      <span style={{fontWeight: 500, color: '#2D3436', fontSize: 14}}>{content.title}</span>
                      <Link href={`/content/${content.id}`} style={{color: '#6C5CE7', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4}}>
                        Start Lesson →
                      </Link>
                    </div>
                  ))}
                  {chapter.contents.length === 0 && (
                    <span style={{color: '#636E72', fontSize: 14, fontStyle: 'italic', padding: '8px 0'}}>No content available.</span>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
