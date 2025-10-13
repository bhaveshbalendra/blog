import { env } from "@/config/envConfig";
import { logger } from "@/lib/logger";
import { db } from "./drizzle";
import { categories, postCategories, posts } from "./schema";

if (env.NEXT_ENV === "development") {
  async function seed() {
    logger.log("🌱 Starting database seed...");

    try {
      // Clear existing data
      logger.log("🧹 Clearing existing data...");
      await db.delete(postCategories);
      await db.delete(posts);
      await db.delete(categories);

      // Create categories
      logger.log("📂 Creating categories...");
      const [techCategory, lifestyleCategory, tutorialCategory] = await db
        .insert(categories)
        .values([
          {
            name: "Technology",
            description:
              "Posts about technology, programming, and software development",
            slug: "technology",
          },
          {
            name: "Lifestyle",
            description:
              "Personal stories, lifestyle tips, and general musings",
            slug: "lifestyle",
          },
          {
            name: "Tutorials",
            description: "Step-by-step guides and how-to articles",
            slug: "tutorials",
          },
        ])
        .returning();

      // Create posts
      logger.log("📝 Creating posts...");
      const [post1, post2, post3] = await db
        .insert(posts)
        .values([
          {
            title: "Getting Started with Next.js 15",
            content:
              "Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced TypeScript support. In this post, we'll explore the key changes and how to migrate your existing applications.",
            slug: "getting-started-nextjs-15",
            published: true,
          },
          {
            title: "Building a Modern Blog with Drizzle ORM",
            content:
              "Drizzle ORM is a lightweight and performant TypeScript ORM that's perfect for modern web applications. Learn how to set up Drizzle with PostgreSQL and create a robust blog system with proper relationships and migrations.",
            slug: "building-blog-drizzle-orm",
            published: true,
          },
          {
            title: "My Journey into Web Development",
            content:
              "After years of working in different fields, I finally decided to pursue my passion for web development. This is the story of how I transitioned careers and what I learned along the way.",
            slug: "journey-web-development",
            published: false,
          },
        ])
        .returning();

      // Create post-category relationships
      logger.log("🔗 Creating post-category relationships...");
      await db.insert(postCategories).values([
        {
          postId: post1.id,
          categoryId: techCategory.id,
        },
        {
          postId: post1.id,
          categoryId: tutorialCategory.id,
        },
        {
          postId: post2.id,
          categoryId: techCategory.id,
        },
        {
          postId: post2.id,
          categoryId: tutorialCategory.id,
        },
        {
          postId: post3.id,
          categoryId: lifestyleCategory.id,
        },
      ]);

      logger.log("✅ Database seeded successfully!");
      logger.log(`📊 Created:`);
      logger.log(`   - ${3} categories`);
      logger.log(`   - ${3} posts`);
      logger.log(`   - ${5} post-category relationships`);
    } catch (error) {
      logger.error("❌ Error seeding database:", error);
      process.exit(1);
    }
  }

  // Run the seed function
  seed()
    .then(() => {
      logger.log("🎉 Seed completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("💥 Seed failed:", error);
      process.exit(1);
    });
}
