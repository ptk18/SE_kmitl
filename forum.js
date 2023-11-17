console.log("Hello from forum JS")
const postCreationForm = document.getElementById("post-creation");
var current_user = localStorage.getItem('current-user');
console.log("current-user: ", current_user);
const postTextarea = document.getElementById('post-textarea');
const postButton = document.getElementById('postBtn');
console.log(postButton.textContent);

let current_post_ID;

//Initially set the mode to "post"
let mode = "post";

let visibility = "false";

// Function to create a new post
async function createPost(username, content, time) {
    try {
        const response = await fetch('http://localhost:8000/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, content, time })
        });

        if (response.ok) {
            console.log('Post created successfully');
            // Handle success, e.g., display a success message to the user
        } else {
            console.error('Failed to create the post');
            // Handle failure, e.g., display an error message to the user
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to send a comment to the server
async function createComment(postId, username, content) {
    console.log("IN create comment");
    try {
        console.log("Before fetching comment");
        const response = await fetch('http://localhost:8000/create-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({post_id: postId, username: username, content: content, time: new Date().toLocaleString()}),
        });
        console.log(response);

        if (response.ok) {
            console.log('Comment created successfully');
            // Optionally, you can update the UI to show the new comment
        } else {
            console.error('Failed to create the comment');
            // Handle failure, e.g., display an error message to the user
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getComments(postId) {
    try {
        const response = await fetch(`http://localhost:8000/get-comments/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const comments = await response.json();
            return comments;
        } else {
            console.error('Failed to retrieve comments');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deletePost(postId, username) {
    try {
        const response = await fetch(`http://localhost:8000/delete-post/${postId}/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error('Failed to delete the post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editPost(postId, username, updatedPostData) {
    try {
        const response = await fetch(`http://localhost:8000/update-post/${postId}/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPostData), // Include the updated post data in the request body
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error('Failed to edit the post');
            
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



postCreationForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log("Event listener triggered"); // Debugging line

    const postContent = document.getElementById('post-textarea').value;

    const currentDate = new Date();
    const currentDateTimeString = currentDate.toLocaleString(); // Ensure it's defined here

    if (mode === "post" && postButton.textContent === "POST") {
        createPost(current_user, postContent, currentDateTimeString);
    } else if (mode === "comment" && postButton.textContent === "COMMENT") {
        console.log("Current Post Id at this place ", current_post_ID);
        await createComment(current_post_ID, current_user, postContent);
        const updatedComments = await getComments(current_post_ID);
    } else if (mode === "edit" && postButton.textContent === "EDIT") {
        console.log("in editing mode");
        const updatedPostData = {
            username: current_user,
            content: postContent,
            time: currentDateTimeString,
        };

        console.log("Updated post data:", updatedPostData); // Debugging line

        editPost(current_post_ID, current_user, updatedPostData);
    }
});





const postsContainer = document.getElementById("posts-container");

// Function to get and display posts
async function getPosts() {
    try {
        const response = await fetch('http://localhost:8000/get-posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const posts = await response.json();
            // Clear the existing content in postsContainer
            postsContainer.innerHTML = '';

            // Create an array of promises to fetch comments for each post
            const commentPromises = posts.map(post => getComments(post.id));

            // Fetch comments concurrently for all posts
            const commentsArray = await Promise.all(commentPromises);

            posts.forEach((post, index) => {
                // Create a post card element
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');

                // Create the post card header
                const postCardHeader = document.createElement('div');
                postCardHeader.classList.add('post-card-header');

                // Create the user header
                const userHeader = document.createElement('div');
                userHeader.classList.add('post-card-user-header');

                // Create the user icon
                const userIcon = document.createElement('div');
                userIcon.classList.add('user-icon');
                const userImage = document.createElement('img');
                userImage.src = 'https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-orange.png';
                userImage.alt = 'User Icon';
                userIcon.appendChild(userImage);

                userIcon.addEventListener('click', async () => {
                    try {
                        const userProfileResponse = await fetch(`http://localhost:8000/profile/${post.username}`, {
                            method: 'GET',
                            // No need to set 'Content-Type' for a GET request to receive HTML
                        });
                
                        if (userProfileResponse.ok) {
                            try {
                                // Assuming the response is HTML content
                                const htmlContent = await userProfileResponse.text();
                
                                // Open a new window or tab with the fetched HTML content
                                const userProfileWindow = window.open('', '_blank');
                                userProfileWindow.document.write(htmlContent);
                            } catch (error) {
                                console.error('Error reading HTML content:', error);
                            }
                        } else {
                            console.error('Failed to retrieve user profile');
                        }
                    } catch (error) {
                        console.error('Error fetching user profile:', error);
                    }
                });
                
                
                // Create the username
                const usernameInPostCard = document.createElement('div');
                usernameInPostCard.classList.add('username-in-post-card');
                usernameInPostCard.textContent = post.username;

                userHeader.appendChild(userIcon);
                userHeader.appendChild(usernameInPostCard);

                // Create the posted time
                const postedTime = document.createElement('div');
                postedTime.classList.add('posted-time');
                const timeParagraph = document.createElement('p');
                timeParagraph.textContent = post.time;
                postedTime.appendChild(timeParagraph);

                // Create the post content
                const postContent = document.createElement('div');
                postContent.classList.add('post-content');
                postContent.textContent = post.content;

                postCardHeader.appendChild(userHeader);
                postCardHeader.appendChild(postedTime);

                const commentIconContainer = document.createElement('div');
                commentIconContainer.classList.add('comment-icon-container');

                const commentIcon = document.createElement('i');
                commentIcon.classList.add('fas', 'fa-comment', 'comment-icon', 'fa-lg');

                const trashbin = document.createElement('i');
                trashbin.classList.add('fas', 'fa-trash-o', 'trash-bin', 'fa-lg');

                const edit = document.createElement('i');
                edit.classList.add('fas', 'fa-edit', 'edit', 'fa-lg')

                const commentCount = document.createElement('span');
                commentCount.classList.add('comment-count');
                commentCount.textContent = commentsArray[index].length;
                
                commentIconContainer.appendChild(commentIcon);
                commentIconContainer.appendChild(commentCount);
                commentIconContainer.appendChild(trashbin);
                commentIconContainer.appendChild(edit);

                let commmentBox = document.createElement('div');
                commmentBox.classList.add('commentBox');
                current_post_ID = post.id;
                commentIcon.addEventListener('click', async () => {
                    if (mode === "post" || mode === "comment"){
                        // Switch to comment mode
                        mode = "comment";
                        postButton.textContent = "COMMENT";
                    }
                    const commentText = postTextarea.value;
                    current_post_ID = post.id;
                
                    let commentContainer = postCard.querySelector('.comment-content');
                
                    // Check if comments are currently visible for this post
                    const isVisible = commentContainer && commentContainer.style.display !== 'none';
                
                    if (!isVisible) {
                        if (!commentContainer) {
                            // Create the comment content if it doesn't exist
                            commentContainer = document.createElement('div');
                            commentContainer.classList.add('comment-content');
                            postCard.appendChild(commentContainer);
                        }
                
                        try {
                            const comments = await getComments(post.id);
                
                            // Clear existing content in commentContent
                            commentContainer.innerHTML = '';
                
                            comments.forEach(comment => {
                                // Create the commentCard header
                                const commentCardHeader = document.createElement('div');
                                commentCardHeader.classList.add('comment-card-header');
                
                                // Create the commentHeader
                                const commentHeader = document.createElement('div');
                                commentHeader.classList.add('comment-card-user-header');
                
                                // Create the user icon
                                const userIcon_of_comment = document.createElement('div');
                                userIcon_of_comment.classList.add('user-icon');
                                const userImage_of_comment = document.createElement('img');
                                userImage_of_comment.src = 'https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-orange.png';
                                userImage_of_comment.alt = 'User Icon';
                                userIcon_of_comment.appendChild(userImage_of_comment);
                
                                // Create the username
                                const usernameInCommentCard = document.createElement('div');
                                usernameInCommentCard.classList.add('username-in-comment-card');
                                usernameInCommentCard.textContent = comment.username;
                
                                commentHeader.appendChild(userIcon_of_comment);
                                commentHeader.appendChild(usernameInCommentCard);
                
                                // Create the posted time of comment
                                const postedTime_of_comment = document.createElement('div');
                                postedTime_of_comment.classList.add('posted-time-of-comment');
                                const timeParagraph_of_comment = document.createElement('p');
                                timeParagraph_of_comment.textContent = comment.time;
                                postedTime_of_comment.appendChild(timeParagraph_of_comment);
                
                                commentCardHeader.appendChild(commentHeader);
                                commentCardHeader.appendChild(postedTime_of_comment);
                
                                // Create the comment content
                                const commentContent = document.createElement('div');
                                commentContent.classList.add('comment-content');
                                commentContent.textContent = comment.content;
                
                                const commentCard = document.createElement('div');
                                commentCard.classList.add('comment-card');
                                commentCard.appendChild(commentCardHeader);
                                commentCard.appendChild(commentContent);
                
                                commentContainer.appendChild(commentCard);
                            });
                
                            commentContainer.style.display = 'block'; // Show comments
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    } else {
                        // Comments are currently visible, hide them
                        commentContainer.style.display = 'none';
                        postButton.textContent = "POST";
                        mode = "post";
                    }
                });

                trashbin.addEventListener('click', async () => {
                    const deletingPost = await deletePost(post.id,current_user);
                });

                edit.addEventListener('click', async () => {
                    if (mode === "post" || mode === "comment") {
                        // Switch to edit mode
                        mode = "edit";
                        postButton.textContent = "EDIT";
                
                        const currentDateTime = new Date();
                        const currentDateTimeString = currentDateTime.toLocaleString();
                
                        const updatedPostData = {
                            username: current_user,
                            content: postTextarea.value,
                            time: currentDateTimeString,
                        };
                
                        // Call the editPost function with the updated data
                        //await editPost(current_post_ID, current_user, updatedPostData);
                    }
                });
                
                
                

                postCard.appendChild(postCardHeader);
                postCard.appendChild(postContent);
                postCard.appendChild(commentIconContainer);

                // Append the post card to the postsContainer
                postsContainer.appendChild(postCard);

            });
        } else {
            console.error('Failed to retrieve posts');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the getPosts function when the page loads
getPosts();

