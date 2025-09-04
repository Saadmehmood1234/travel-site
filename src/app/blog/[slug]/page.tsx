import { getBlogBySlug, getBlogs } from '@/app/actions/blog.actions';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const blogs = await getBlogs();
  
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function renderContentBlock(block: any, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {block.content}
        </p>
      );
    
    case 'subheading':
      const level = block.level || 2;
      const headingProps = {
        key: index,
        className: "font-heading font-bold text-gray-900 mt-8 mb-4",
        style: { 
          fontSize: level === 2 ? '1.5rem' : 
                   level === 3 ? '1.25rem' : 
                   level === 4 ? '1.125rem' : '1rem' 
        }
      };
      
      switch (level) {
        case 1:
          return <h1 {...headingProps}>{block.content}</h1>;
        case 2:
          return <h2 {...headingProps}>{block.content}</h2>;
        case 3:
          return <h3 {...headingProps}>{block.content}</h3>;
        case 4:
          return <h4 {...headingProps}>{block.content}</h4>;
        case 5:
          return <h5 {...headingProps}>{block.content}</h5>;
        case 6:
          return <h6 {...headingProps}>{block.content}</h6>;
        default:
          return <h2 {...headingProps}>{block.content}</h2>;
      }
    
    case 'image':
      return (
        <div key={index} className="my-8">
          <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image
              src={block.content || "/placeholder.svg"}
              alt={block.caption || "Blog image"}
              fill
              className="object-cover"
            />
          </div>
          {block.caption && (
            <p className="text-center text-sm text-gray-600 mt-2 italic">
              {block.caption}
            </p>
          )}
        </div>
      );
    
    case 'code':
      return (
        <div key={index} className="my-6 bg-gray-900 rounded-lg overflow-hidden">
          <pre className="p-4 overflow-x-auto">
            <code className={`language-${block.language || 'javascript'} text-sm`}>
              {block.content}
            </code>
          </pre>
          {block.caption && (
            <p className="bg-gray-800 text-gray-300 text-sm p-3 italic">
              {block.caption}
            </p>
          )}
        </div>
      );
    
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-primary-500 pl-6 my-6 italic text-gray-700">
          <p className="text-lg">{block.content}</p>
          {block.caption && (
            <footer className="text-sm text-gray-600 mt-2 not-italic">
              — {block.caption}
            </footer>
          )}
        </blockquote>
      );
    
    default:
      return (
        <p key={index} className="mb-4 text-gray-700">
          {block.content}
        </p>
      );
  }
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Link>
        
        <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
          <Image
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 italic">
            {blog.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{blog.readTime}</span>
            </div>
          </div>
          
          <div className="prose max-w-none prose-lg">
            {blog.content?.map((block: any, index: number) => 
              renderContentBlock(block, index)
            )}
          </div>
        </div>
      </div>
    </article>
  );
}