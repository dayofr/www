<script lang="ts" setup>

import {reactive, ref} from "vue";

interface BlueskyPost {
  post: {
    author: {
      avatar: string;
      displayName: string;
      handle: string;
    };
    record: {
      text: string;
    };
    indexedAt: string;
    likeCount: number;
    repostCount: number;
    replyCount: number;
  };
  replies?: BlueskyPost[];
}

import {useData} from 'vitepress'

const {frontmatter} = useData()
const {bskyUri} = frontmatter.value;

// Get the post ID for the Bluesky link

let comments: BlueskyPost[] = reactive([]);
let error = ref(null);

if (bskyUri) {
  try {
    const endpoint = `https://api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(bskyUri)}`;

    fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
        .then(response => response.json())
        .then(data => {
          if (data.thread?.replies) {
            comments.push(...data.thread.replies);
          }
        })
        .catch(error => {
          throw new Error(`Failed to fetch comments: ${error.status}`)
        });
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<template>
  <div v-if="bskyUri" class="comments-section">
    <h2>Comments</h2>
    <p class="comment-prompt">
      Reply on Bluesky <a :href="'https://bsky.app/profile/'+bskyUri.split('/')[2]+'/post/'+bskyUri.split('/').pop()"
                          rel="noopener noreferrer" target="_blank">here</a> to join the
      conversation.
    </p>

    <p v-if="error" class="error">Error loading comments: {{ error }}</p>

    <p v-else-if="!error && comments.length === 0" class="no-comments">No comments yet. Be the first to comment!</p>

    <div v-if="!error && comments.length > 0" class="comments-list">
      <div v-for="comment in comments" class="comment">
        <div v-if="comment.post">
          <div class="comment-header">
            <img :alt="comment.post.author.displayName + '\'s avatar'" :src="comment.post.author.avatar"
                 class="avatar"/>
            <div class="author-info">
              <span class="author-name">{{ comment.post.author.displayName }}</span>
              <span class="author-handle">@{{ comment.post.author.handle }}</span>
            </div>
          </div>
          <div class="comment-content">
            {{ comment.post.record.text }}
          </div>
          <div class="comment-footer">
            <div class="interaction-counts">
              <span>{{ comment.post.replyCount || 0 }} 💬</span>
              <span>{{ comment.post.repostCount || 0 }} 🔁</span>
              <span>{{ comment.post.likeCount || 0 }} ❤️</span>
            </div>
            <time datetime={comment.post.indexedAt}>
              {{ new Date(comment.post.indexedAt).toLocaleDateString() }}
            </time>
          </div>
          <div v-if="comment.replies && comment.replies.length > 0" class="replies">
            <div v-for="reply in comment.replies" class="reply comment">
              <div class="comment-header">
                <img :alt="reply.post.author.displayName + '\'s avatar'" :src="reply.post.author.avatar"
                     class="avatar"/>
                <div class="author-info">
                  <span class="author-name">{{ reply.post.author.displayName }}</span>
                  <span class="author-handle">@{{ reply.post.author.handle }}</span>
                </div>
              </div>
              <div class="comment-content">
                {{ reply.post.record.text }}
              </div>
              <div class="comment-footer">
                <div class="interaction-counts">
                  <span>{{ reply.post.replyCount || 0 }} 💬</span>
                  <span>{{ reply.post.repostCount || 0 }} 🔁</span>
                  <span>{{ reply.post.likeCount || 0 }} ❤️</span>
                </div>
                <time :datetime="reply.post.indexedAt">
                  {{ new Date(reply.post.indexedAt).toLocaleDateString() }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic styling - users can customize this */
.comments-section {
  margin-top: 2rem;
  padding-top: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  padding: 8px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.interaction-counts {
  display: flex;
  gap: 1rem;
}

.replies {
  margin-left: 1.5rem;
  margin-top: .75rem;
  padding-left: .75rem;
  border-left: 2px solid var(--vp-c-bg);
}

.reply.comment {
  background-color: var(--vp-c-bg);
}

</style>