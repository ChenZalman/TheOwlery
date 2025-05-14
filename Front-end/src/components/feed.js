import Post from "./post";

export default function Feed({posts}) {

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
          key = {post.id}
        user = {
          {userName:post.userName,
          textContent:post.textContent,
          mediaUrl:post.mediaUrl,
          mediaType:post.mediaType}}
        />
      ))}
    </div>
  );
}