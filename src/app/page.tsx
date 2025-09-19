import { link } from 'fs';
import Header from './components/header';

export default function Home() {
  const post = {
    title: "My first post",
    author: "user tester",
  };

  return (
    <div>
      <Header/>

      <div>
        {post && (
          
          <div className="p-4 m-4 border rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">by {post.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}

