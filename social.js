document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const postFeed = document.getElementById('postFeed');
    const postModal = document.getElementById('postModal');
    const pollModal = document.getElementById('pollModal');
    const openPostModalBtn = document.getElementById('openPostModal');
    const closeModalBtns = document.querySelectorAll('.close');
    const postText = document.getElementById('postText');
    const charCount = document.getElementById('charCount');
    const postPreview = document.getElementById('postPreview');
    const submitPostBtn = document.getElementById('submitPost');
    const addOptionBtn = document.getElementById('addOption');
    const submitPollBtn = document.getElementById('submitPoll');
    const pollQuestion = document.getElementById('pollQuestion');
    const pieChart = document.getElementById('pollChart');

    // Sample data
    let posts = [
        {
            id: 1,
            user: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            time: '2 hours ago',
            content: 'Just launched my new portfolio website! Check it out and let me know what you think. #webdev #portfolio',
            likes: 24,
            comments: [
                {
                    user: 'Mike Johnson',
                    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                    text: 'Looks amazing! Love the animations.',
                    time: '1 hour ago',
                    likes: 3
                }
            ],
            reactions: {
                like: 15,
                love: 5,
                laugh: 2,
                wow: 1,
                sad: 0,
                angry: 1
            }
        },
        {
            id: 2,
            user: 'Alex Chen',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            time: '5 hours ago',
            content: 'Poll: Which JavaScript framework do you prefer for large-scale applications?',
            poll: {
                question: 'Which JavaScript framework do you prefer for large-scale applications?',
                options: [
                    { text: 'React', votes: 45 },
                    { text: 'Angular', votes: 30 },
                    { text: 'Vue', votes: 25 },
                    { text: 'Svelte', votes: 15 }
                ],
                totalVotes: 115
            },
            comments: [],
            reactions: {
                like: 10,
                love: 2,
                laugh: 0,
                wow: 1,
                sad: 0,
                angry: 0
            }
        }
    ];

    // Initialize the app
    init();

    function init() {
        renderPosts();
        setupEventListeners();
    }

    function renderPosts() {
        postFeed.innerHTML = '';
        
        posts.forEach(post => {
            const postEl = createPostElement(post);
            postFeed.appendChild(postEl);
        });
        
        // Add infinite scroll loader at the end
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<i class="fas fa-spinner"></i>';
        postFeed.appendChild(loader);
        
        // Simulate loading more posts when scrolling
        setupInfiniteScroll();
    }

    function createPostElement(post) {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.dataset.id = post.id;
        
        // Post header
        let postHtml = `
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.user}">
                <div class="post-user">
                    <h4>${post.user}</h4>
                    <span class="post-time">${post.time}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
        `;
        
        // Poll content if it's a poll
        if (post.poll) {
            postHtml += `
                <div class="poll">
                    <h4>${post.poll.question}</h4>
                    <div class="poll-options">
            `;
            
            post.poll.options.forEach(option => {
                const percentage = post.poll.totalVotes > 0 
                    ? Math.round((option.votes / post.poll.totalVotes) * 100) 
                    : 0;
                
                postHtml += `
                    <div class="poll-option">
                        <div class="option-text">${option.text}</div>
                        <div class="option-bar">
                            <div class="option-fill" style="width: ${percentage}%"></div>
                            <span class="option-percentage">${percentage}%</span>
                        </div>
                    </div>
                `;
            });
            
            postHtml += `
                    </div>
                    <div class="poll-total">${post.poll.totalVotes} votes</div>
                </div>
            `;
        }
        
        // Reactions
        postHtml += `
            <div class="reactions">
                <span class="reaction" data-reaction="like">👍 ${post.reactions.like}</span>
                <span class="reaction" data-reaction="love">❤️ ${post.reactions.love}</span>
                <span class="reaction" data-reaction="laugh">😂 ${post.reactions.laugh}</span>
                <span class="reaction" data-reaction="wow">😮 ${post.reactions.wow}</span>
                <span class="reaction" data-reaction="sad">😢 ${post.reactions.sad}</span>
                <span class="reaction" data-reaction="angry">😠 ${post.reactions.angry}</span>
            </div>
        `;
        
        // Post actions
        postHtml += `
            <div class="post-actions">
                <div class="post-action like-btn">
                    <i class="far fa-thumbs-up"></i>
                    <span class="like-count">${post.likes}</span>
                </div>
                <div class="post-action comment-btn">
                    <i class="far fa-comment"></i>
                    <span class="comment-count">${post.comments.length}</span>
                </div>
                <div class="post-action share-btn">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </div>
            </div>
        `;
        
        // Comments section
        if (post.comments.length > 0) {
            postHtml += `<div class="comment-section">`;
            
            post.comments.forEach(comment => {
                postHtml += `
                    <div class="comment">
                        <img src="${comment.avatar}" alt="${comment.user}">
                        <div class="comment-content">
                            <div class="comment-user">${comment.user}</div>
                            <div class="comment-text">${comment.text}</div>
                            <div class="comment-actions">
                                <span class="like-comment">Like</span>
                                <span class="reply-comment">Reply</span>
                                <span class="comment-time">${comment.time}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            postHtml += `</div>`;
        }
        
        // Comment input
        postHtml += `
            <div class="comment-input">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User">
                <input type="text" placeholder="Write a comment...">
            </div>
        `;
        
        postEl.innerHTML = postHtml;
        return postEl;
    }

    function setupEventListeners() {
        // Modal open/close
        if (openPostModalBtn) {
            openPostModalBtn.addEventListener('click', () => {
                postModal.style.display = 'block';
            });
        }
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                postModal.style.display = 'none';
                pollModal.style.display = 'none';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === postModal) {
                postModal.style.display = 'none';
            }
            if (e.target === pollModal) {
                pollModal.style.display = 'none';
            }
        });
        
        // Character counter for post
        if (postText) {
            postText.addEventListener('input', () => {
                charCount.textContent = postText.value.length;
                
                if (postText.value.length > 0) {
                    postPreview.textContent = postText.value;
                    postPreview.style.display = 'block';
                } else {
                    postPreview.style.display = 'none';
                }
            });
        }
        
        // Submit post
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const content = postText.value.trim();
                
                if (content) {
                    const newPost = {
                        id: posts.length + 1,
                        user: 'Aashiv Kohli',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        time: 'Just now',
                        content: content,
                        likes: 0,
                        comments: [],
                        reactions: {
                            like: 0,
                            love: 0,
                            laugh: 0,
                            wow: 0,
                            sad: 0,
                            angry: 0
                        }
                    };
                    
                    posts.unshift(newPost);
                    renderPosts();
                    
                    postText.value = '';
                    charCount.textContent = '0';
                    postPreview.style.display = 'none';
                    postModal.style.display = 'none';
                }
            });
        }
        
        // Poll creator
        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const optionsContainer = document.querySelector('.poll-options');
                const newOption = document.createElement('div');
                newOption.className = 'poll-option';
                newOption.innerHTML = `
                    <input type="text" placeholder="Option ${optionsContainer.children.length + 1}">
                    <button class="remove-option"><i class="fas fa-times"></i></button>
                `;
                optionsContainer.appendChild(newOption);
                
                // Add event listener to new remove button
                newOption.querySelector('.remove-option').addEventListener('click', (e) => {
                    e.preventDefault();
                    if (optionsContainer.children.length > 2) {
                        optionsContainer.removeChild(newOption);
                    } else {
                        alert('A poll must have at least 2 options');
                    }
                });
            });
        }
        
        // Submit poll
        if (submitPollBtn) {
            submitPollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const question = pollQuestion.value.trim();
                const options = Array.from(document.querySelectorAll('.poll-option input'))
                    .map(input => input.value.trim())
                    .filter(value => value !== '');
                
                if (question && options.length >= 2) {
                    const newPost = {
                        id: posts.length + 1,
                        user: 'John Doe',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        time: 'Just now',
                        content: `Poll: ${question}`,
                        poll: {
                            question: question,
                            options: options.map(option => ({ text: option, votes: 0 })),
                            totalVotes: 0
                        },
                        likes: 0,
                        comments: [],
                        reactions: {
                            like: 0,
                            love: 0,
                            laugh: 0,
                            wow: 0,
                            sad: 0,
                            angry: 0
                        }
                    };
                    
                    posts.unshift(newPost);
                    renderPosts();
                    
                    pollQuestion.value = '';
                    document.querySelector('.poll-options').innerHTML = `
                        <div class="poll-option">
                            <input type="text" placeholder="Option 1">
                            <button class="remove-option"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="poll-option">
                            <input type="text" placeholder="Option 2">
                            <button class="remove-option"><i class="fas fa-times"></i></button>
                        </div>
                    `;
                    
                    // Re-add event listeners to remove buttons
                    document.querySelectorAll('.remove-option').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (document.querySelector('.poll-options').children.length > 2) {
                                btn.parentElement.remove();
                            } else {
                                alert('A poll must have at least 2 options');
                            }
                        });
                    });
                    
                    pollModal.style.display = 'none';
                } else {
                    alert('Please provide a question and at least 2 options');
                }
            });
        }
        
        // Event RSVP buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('going') || e.target.classList.contains('interested')) {
                const btn = e.target;
                const isGoing = btn.classList.contains('going');
                
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                } else {
                    // Remove active class from siblings
                    Array.from(btn.parentElement.children).forEach(sibling => {
                        sibling.classList.remove('active');
                    });
                    
                    btn.classList.add('active');
                    
                    if (isGoing) {
                        btn.textContent = '✓ Going';
                    } else {
                        btn.textContent = '✓ Interested';
                    }
                }
            }
        });
    }

    function setupInfiniteScroll() {
        const loader = document.querySelector('.loader');
        let isLoading = false;
        
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
                isLoading = true;
                loader.style.display = 'block';
                
                // Simulate loading more posts
                setTimeout(() => {
                    loadMorePosts();
                    isLoading = false;
                    loader.style.display = 'none';
                }, 1000);
            }
        });
    }

    function loadMorePosts() {
        // In a real app, you would fetch more posts from a server
        const newPosts = [
            {
                id: posts.length + 1,
                user: 'Sarah Williams',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                time: '1 day ago',
                content: 'Working on a new project using React and Firebase. So excited about the possibilities! #reactjs #firebase #webdev',
                likes: 42,
                comments: [
                    {
                        user: 'Tom Brown',
                        avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
                        text: 'Firebase is amazing for quick prototyping!',
                        time: '20 hours ago',
                        likes: 5
                    },
                    {
                        user: 'Lisa Chen',
                        avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
                        text: 'What are you building?',
                        time: '18 hours ago',
                        likes: 2
                    }
                ],
                reactions: {
                    like: 30,
                    love: 8,
                    laugh: 1,
                    wow: 2,
                    sad: 0,
                    angry: 1
                }
            },
            {
                id: posts.length + 2,
                user: 'Tech News',
                avatar: 'https://randomuser.me/api/portraits/lego/5.jpg',
                time: '2 days ago',
                content: 'Breaking: New JavaScript framework released that promises 10x faster rendering times than React!',
                likes: 128,
                comments: [
                    {
                        user: 'Dev Guru',
                        avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
                        text: 'I\'ll believe it when I see the benchmarks...',
                        time: '1 day ago',
                        likes: 15
                    }
                ],
                reactions: {
                    like: 80,
                    love: 20,
                    laugh: 10,
                    wow: 15,
                    sad: 2,
                    angry: 1
                }
            }
        ];
        
        posts = [...posts, ...newPosts];
        renderPosts();
    }

    // Initialize chart for poll preview
    if (pieChart) {
        const ctx = pieChart.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['React', 'Angular', 'Vue', 'Svelte'],
                datasets: [{
                    data: [45, 30, 25, 15],
                    backgroundColor: [
                        '#45f3ff',
                        '#ff6b6b',
                        '#6bff6b',
                        '#ffdb6b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Delegate events for dynamic content
    document.addEventListener('click', (e) => {
        // Like button
        if (e.target.closest('.like-btn')) {
            const postEl = e.target.closest('.post');
            const likeCount = postEl.querySelector('.like-count');
            const currentLikes = parseInt(likeCount.textContent);
            
            if (postEl.classList.contains('liked')) {
                likeCount.textContent = currentLikes - 1;
                postEl.classList.remove('liked');
            } else {
                likeCount.textContent = currentLikes + 1;
                postEl.classList.add('liked');
            }
        }
        
        // Comment submission
        if (e.target.closest('.comment-input button') || 
            (e.target.closest('.comment-input input') && e.key === 'Enter')) {
            const input = e.target.closest('.comment-input').querySelector('input');
            const commentText = input.value.trim();
            
            if (commentText) {
                const postEl = e.target.closest('.post');
                const postId = parseInt(postEl.dataset.id);
                const post = posts.find(p => p.id === postId);
                
                if (post) {
                    const newComment = {
                        user: 'John Doe',
                        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                        text: commentText,
                        time: 'Just now',
                        likes: 0
                    };
                    
                    post.comments.unshift(newComment);
                    renderPosts();
                    input.value = '';
                }
            }
        }
        
        // Emoji reactions
        if (e.target.closest('.reaction')) {
            const reactionEl = e.target.closest('.reaction');
            const reactionType = reactionEl.dataset.reaction;
            const postEl = reactionEl.closest('.post');
            const postId = parseInt(postEl.dataset.id);
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                post.reactions[reactionType]++;
                renderPosts();
            }
        }
        
        // Poll voting
        if (e.target.closest('.poll-option')) {
            const optionEl = e.target.closest('.poll-option');
            const postEl = optionEl.closest('.post');
            const postId = parseInt(postEl.dataset.id);
            const post = posts.find(p => p.id === postId);
            
            if (post && post.poll && !postEl.classList.contains('voted')) {
                const optionText = optionEl.querySelector('.option-text').textContent;
                const option = post.poll.options.find(o => o.text === optionText);
                
                if (option) {
                    option.votes++;
                    post.poll.totalVotes++;
                    postEl.classList.add('voted');
                    renderPosts();
                }
            }
        }
    });
});