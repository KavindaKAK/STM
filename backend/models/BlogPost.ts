import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    coverImageUrl?: string;
    content: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImageUrl: String,
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ isPublished: 1, createdAt: -1 });

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
