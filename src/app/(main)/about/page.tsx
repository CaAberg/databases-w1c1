const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">About FISHERDB</h1>
        
        <div className="p-6 border border-gray-700 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">🎣 A Fishing Journal</h2>
          <p className="text-gray-800 leading-relaxed">
            Fishing is more than just a hobby—it's a way to connect with nature, find peace, and create lasting memories. 
            Whether it's the early morning calm on a quiet lake or the thrill of reeling in a catch, every fishing trip tells a story.
          </p>
        </div>

        <div className="p-6 border border-gray-700 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">💻 A Coding Journey</h2>
          <p className="text-gray-800 leading-relaxed">
            FISHERDB is also a personal project where I experiment with web development, databases, and modern coding practices. 
            It's a playground for learning new technologies while building something meaningful—a digital diary to document my fishing adventures 
            and share them with fellow anglers.
          </p>
        </div>

        <div className="p-6 border border-gray-700 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">🌊 What You'll Find Here</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Personal fishing stories and experiences</li>
            <li>Tips, tricks, and lessons learned on the water</li>
            <li>Photos and memories from various fishing spots</li>
            <li>A community space for fellow fishing enthusiasts</li>
          </ul>
        </div>

        <div className="p-6 border border-gray-700 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">🚀 Built With</h2>
          <p className="text-gray-800 leading-relaxed">
            This site is built using Next.js, React, TypeScript, Supabase, and Tailwind CSS. 
            It's a constant work in progress as I continue to learn and add new features.
          </p>
        </div>

        <div className="p-6 border border-gray-700 rounded-2xl text-center">
          <p className="text-gray-800 italic">
            "The charm of fishing is that it is the pursuit of what is elusive but attainable, 
            a perpetual series of occasions for hope." - John Buchan
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
