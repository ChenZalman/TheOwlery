import Post from "./post";

export default function Feed() {
  const posts = [
    {
      id: 1,
      userName: "john_doe",
      textContent: "Check out this amazing sunset 🌅",
      mediaUrl: "https://source.unsplash.com/400x300/?sunset",
      mediaType: "image",
    },
    {
      id: 2,
      userName: "jane_smith",
      textContent: "Here's a snippet from my latest vlog!",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      mediaType: "video",
    },
    {
      id: 3,
      userName: "tech_guy",
      textContent: "Building a new PC today 🛠️",
      mediaUrl: "https://source.unsplash.com/400x300/?computer",
      mediaType: "image",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f2f2f2",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {posts.map((post) => (
        <Post
          key={post.id}
          userName={post.userName}
          textContent={post.textContent}
          mediaUrl={post.mediaUrl}
          mediaType={post.mediaType}
        />
      ))}
    </div>
  );
}