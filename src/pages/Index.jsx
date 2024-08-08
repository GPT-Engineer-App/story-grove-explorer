import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const fetchHNStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['hnStories'],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-300">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-red-900 text-red-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-200">Top 100 Hacker News Stories</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto bg-red-800 text-red-100 placeholder-red-300 border-red-700"
        />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-red-800 p-4 rounded shadow animate-pulse">
              <div className="h-4 bg-red-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-red-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <div key={story.objectID} className="bg-red-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2 text-red-200">{story.title}</h2>
              <p className="text-red-300 mb-2">Upvotes: {story.points}</p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-black text-white hover:bg-gray-800"
              >
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
