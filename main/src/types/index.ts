export interface SocialPost {
  id: string;
  post_type: 'carousel' | 'reels' | 'static_image';
  likes: number;
  shares: number;
  comments: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}