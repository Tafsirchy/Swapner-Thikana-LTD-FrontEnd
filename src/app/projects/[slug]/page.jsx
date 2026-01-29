import api from '@/lib/api';
import ProjectDetailClient from '@/components/project/ProjectDetailClient';
import Link from 'next/link';

// This is a Server Component
const ProjectDetailPage = async ({ params }) => {
  const { slug } = await params;
  let project = null;
  let apiErrorType = null;
  
  console.log(`[ProjectDetailPage] Fetching slug: ${slug}`);
  
  try {
    const res = await api.projects.getBySlug(slug);
    console.log(`[ProjectDetailPage] API Success for ${slug}:`, !!res.data?.project);
    project = res.data?.project;
  } catch (error) {
    apiErrorType = error.response ? `HTTP ${error.response.status}` : error.message;
    console.error(`[ProjectDetailPage] API Error for ${slug}:`, error.message);
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-royal-deep text-zinc-400 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">Project Not Found</h1>
          <p className="mb-8">The architectural project you are looking for does not exist, has been removed, or a server communication error occurred.</p>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-left font-mono">
             <p className="text-zinc-500 mb-2">Diagnostic Info:</p>
             <p>Slug: <span className="text-brand-gold">{slug}</span></p>
             {apiErrorType && <p>API Error Type: <span className="text-red-400">{apiErrorType}</span></p>}
          </div>

          <Link 
            href="/projects"
            className="mt-10 px-6 py-3 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all inline-block"
          >
            Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetailClient project={project} />
  );
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await api.projects.getBySlug(slug);
    const project = res.data.project;

    if (!project) {
        return {
            title: 'Project Not Found | shwapner Thikana Ltd',
        }
    }

    return {
      title: `${project.title} | shwapner Thikana Ltd`,
      description: project.description?.substring(0, 160) || 'Iconic architectural development by shwapner Thikana Ltd.',
    };
  } catch {
    return {
      title: 'shwapner Thikana Ltd - Luxury Real Estate',
    };
  }
}

export default ProjectDetailPage;
