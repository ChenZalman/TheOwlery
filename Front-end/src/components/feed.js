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
      {posts && posts.length > 0 ? posts.map((post) => (
        <Post
          key={post.id || post._id}
          post={{
            userName: post.userName,  
            profilePicture: post.profilePicture,  
            textContent: post.text || post.textContent,
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
            postId: post.id || post._id,
          }}
        />
      )) : (
        <Post post={{ textContent: "Nothing to show. Create a post to share!" }} />
      )}
    </div>
  );
}