
import api from '@/lib/api';
import BlogDetailClient from '@/components/blog/BlogDetailClient';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';

// This is a Server Component
const BlogDetailPage = async ({ params }) => {
  const { slug } = await params;
  let post = null;
  let apiErrorType = null;
  
  try {
    const res = await api.blogs.getBySlug(slug);
    post = res.data.blog;
  } catch (error) {
    apiErrorType = error.response ? `HTTP ${error.response.status}` : error.message;
    console.error(`[BlogDetailPage] API Error for ${slug}:`, error.message);
  }

  if (!post) {
      // We pass null to the client component to handle the 404 UI, 
      // or we could handle it here. 
      // For consistency with the client component's original logic, we can just render it.
      // But passing null prop is cleaner.
  }

  return (
    <>
      {post && (
        <StructuredData 
          type="Article" 
          data={{
            title: post.title,
            description: post.content?.substring(0, 160),
            images: [post.thumbnail || post.image],
            author: post.author,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
            slug: slug
          }} 
        />
      )}
      <BlogDetailClient slug={slug} initialPost={post} />
    </>
  );
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await api.blogs.getBySlug(slug);
    const post = res.data.blog;

    if (!post) {
        return {
            title: 'Article Not Found | shwapner Thikana Ltd',
        }
    }

    return {
      title: `${post.title} | shwapner Thikana Ltd`,
      description: post.content?.substring(0, 160) || 'Luxury real estate insights.',
      openGraph: {
        title: post.title,
        description: post.content?.substring(0, 160),
        images: post.thumbnail ? [{ url: post.thumbnail, width: 1200, height: 630 }] : [],
        type: 'article',
        publishedTime: post.publishedAt || post.createdAt,
        authors: [post.author?.name || 'shwapner Thikana'],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.content?.substring(0, 160),
        images: post.thumbnail ? [post.thumbnail] : [],
      },
      alternates: {
        canonical: `https://shwapner-thikana.com/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: 'shwapner Thikana Ltd - Luxury Journal',
    };
  }
}

export default BlogDetailPage;
