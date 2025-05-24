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
      {posts ? posts.map((post) => (
        <Post
          key = {post.id}
        post = {
          {userName:post.userName,
          profilePicture:post.profilePicture,
          textContent:post.textContent,
          mediaUrl:post.mediaUrl,
          mediaType:post.mediaType,
         postId: post.id || post._id}}///DIDNT WORK WITHOUT _id
         
          
        />
      )) :
        <Post post={{textContent:"nothing to show create a post to share!"}}/>
      }
    </div>
  );
}