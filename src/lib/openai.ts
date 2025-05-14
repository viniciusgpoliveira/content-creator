import OpenAI from "openai";
import { BlogPostParams, SocialCaptionParams } from "@/types";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

const openai = new OpenAI({
  apiKey,
});

/**
 * Generates a blog post using OpenAI API
 * @param params - Blog post parameters
 * @returns Generated blog post content
 */
export async function generateBlogPost(params: BlogPostParams) {
  const { topic, tone, description } = params;

  // Get the user's language from i18next
  const userLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('i18nextLng') || 'en' : 'en';

  const prompt = `
    Write a comprehensive blog post about "${topic}".

    Tone: ${tone}
    ${description ? `Additional context: ${description}` : ''}

    Important instructions:
    1. Write the blog post in ${userLanguage} language
    2. The blog post should have a compelling introduction, well-structured body with subheadings, and a conclusion
    3. Format the content in Markdown
    4. Start directly with the blog post title as a heading (# Title), do not include any introductory text like "Here's a blog post about..."
    5. Make sure the content is engaging and valuable to readers
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional content writer who specializes in creating engaging, well-researched blog posts.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content || "";
}

/**
 * Generates social media captions using OpenAI API
 * @param params - Social caption parameters
 * @returns Generated captions
 */
export async function generateSocialCaptions(params: SocialCaptionParams) {
  const { productTheme, platform, description } = params;

  // Get the user's language from i18next
  const userLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('i18nextLng') || 'en' : 'en';

  const platformSpecificInstructions = {
    twitter: "Keep captions under 280 characters. Use hashtags strategically.",
    linkedin: "Professional tone. Include a call to action. Can be longer form.",
    instagram: "Visual focus. Use emojis and hashtags. Engaging and conversational.",
    facebook: "Conversational and personal. Can be longer form. Include questions to engage audience.",
  };

  const prompt = `
    Generate 5 engaging social media captions for ${platform} about "${productTheme}".

    ${platformSpecificInstructions[platform]}
    ${description ? `Additional context: ${description}` : ''}

    Important instructions:
    1. Write the captions in ${userLanguage} language
    2. Each caption should be unique and compelling
    3. Format as a numbered list (1., 2., etc.)
    4. Start directly with the numbered list, do not include any introductory text like "Here are 5 captions..."
    5. Make sure the captions are appropriate for the platform
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a social media expert who creates engaging, platform-optimized content.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || "";
}
