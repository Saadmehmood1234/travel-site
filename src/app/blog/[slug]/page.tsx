
import { getBlogBySlug, getBlogs } from '@/app/actions/blog.actions';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const blogs = await getBlogs();
  
  return blogs.map((blog:any) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog" 
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
          />
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>
          
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
          
          <div 
            className="prose max-w-none prose-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </article>
  );
}