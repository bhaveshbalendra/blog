import { env } from "@/config/envConfig";
import { logger } from "@/lib/logger/logger";
import { db } from "./drizzle";
import { categories, postCategories, posts } from "./schemas/drizzle";

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
      const [
        techCategory,
        lifestyleCategory,
        tutorialCategory,
        designCategory,
        businessCategory,
        healthCategory,
        travelCategory,
        foodCategory,
      ] = await db
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
          {
            name: "Design",
            description: "UI/UX design, graphic design, and creative content",
            slug: "design",
          },
          {
            name: "Business",
            description: "Entrepreneurship, marketing, and business insights",
            slug: "business",
          },
          {
            name: "Health",
            description: "Health tips, fitness, and wellness content",
            slug: "health",
          },
          {
            name: "Travel",
            description: "Travel guides, destinations, and travel experiences",
            slug: "travel",
          },
          {
            name: "Food",
            description: "Recipes, cooking tips, and food reviews",
            slug: "food",
          },
        ])
        .returning();

      // Create posts
      logger.log("📝 Creating posts...");
      const [post1, post2, post3, post4, post5, post6] = await db
        .insert(posts)
        .values([
          {
            title: "Getting Started with Next.js 15: A Complete Guide",
            content: `# Getting Started with Next.js 15: A Complete Guide

Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced TypeScript support. In this comprehensive guide, we'll explore the key changes and how to migrate your existing applications.

## What's New in Next.js 15

### 🚀 Performance Improvements
- **Faster Build Times**: Up to 40% faster builds with improved caching
- **Better Bundle Splitting**: Automatic code splitting for optimal loading
- **Enhanced Image Optimization**: New Image component with better performance

### 🛠️ Developer Experience
- **Improved TypeScript Support**: Better type inference and error messages
- **Enhanced Dev Tools**: Better debugging and profiling capabilities
- **Streamlined Configuration**: Simplified setup process

## Key Features

### 1. App Router Enhancements
\`\`\`typescript
// New layout structure
app/
  layout.tsx
  page.tsx
  blog/
    layout.tsx
    page.tsx
    [slug]/
      page.tsx
\`\`\`

### 2. Server Components
Server Components allow you to run React components on the server, reducing the JavaScript bundle size and improving performance.

### 3. Streaming
Next.js 15 introduces streaming capabilities that allow you to render parts of your page as they become ready.

## Migration Guide

### Step 1: Update Dependencies
\`\`\`bash
npm install next@15 react@18 react-dom@18
\`\`\`

### Step 2: Update Configuration
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
\`\`\`

## Best Practices

1. **Use Server Components** when possible
2. **Implement proper error boundaries**
3. **Optimize images** with the new Image component
4. **Leverage streaming** for better user experience

## Conclusion

Next.js 15 represents a significant step forward in React development. With its improved performance, better developer experience, and new features, it's the perfect choice for modern web applications.

Ready to get started? Check out the [official documentation](https://nextjs.org/docs) for more information.`,
            slug: "getting-started-nextjs-15",
            published: true,
          },
          {
            title: "Building a Modern Blog with Drizzle ORM",
            content: `# Building a Modern Blog with Drizzle ORM

Drizzle ORM is a lightweight and performant TypeScript ORM that's perfect for modern web applications. Learn how to set up Drizzle with PostgreSQL and create a robust blog system with proper relationships and migrations.

## Why Drizzle ORM?

### 🎯 Key Benefits
- **Type Safety**: Full TypeScript support with excellent type inference
- **Performance**: Minimal overhead compared to other ORMs
- **SQL-like Syntax**: Familiar SQL syntax for complex queries
- **Zero Runtime**: No runtime overhead in production

## Project Setup

### 1. Install Dependencies
\`\`\`bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
\`\`\`

### 2. Database Schema
\`\`\`typescript
// db/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
\`\`\`

### 3. Database Connection
\`\`\`typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);
\`\`\`

## Advanced Features

### Complex Queries
\`\`\`typescript
// Get posts with categories
const postsWithCategories = await db
  .select({
    post: posts,
    category: categories,
  })
  .from(posts)
  .innerJoin(postCategories, eq(posts.id, postCategories.postId))
  .innerJoin(categories, eq(postCategories.categoryId, categories.id))
  .where(eq(posts.published, true));
\`\`\`

### Migrations
\`\`\`typescript
// Generate migration
npx drizzle-kit generate

// Run migration
npx drizzle-kit migrate
\`\`\`

## Best Practices

1. **Use proper indexing** for better performance
2. **Implement soft deletes** for data integrity
3. **Use transactions** for complex operations
4. **Optimize queries** with proper joins

## Conclusion

Drizzle ORM provides an excellent balance between type safety, performance, and developer experience. It's perfect for building modern applications with TypeScript and PostgreSQL.`,
            slug: "building-blog-drizzle-orm",
            published: true,
          },
          {
            title: "My Journey into Web Development: A Personal Story",
            content: `# My Journey into Web Development: A Personal Story

After years of working in different fields, I finally decided to pursue my passion for web development. This is the story of how I transitioned careers and what I learned along the way.

## The Beginning

### Why I Started
I was working as a marketing manager for a tech company when I first encountered web development. I was fascinated by how websites worked and wanted to understand the magic behind the scenes.

### First Steps
- **HTML & CSS**: Started with basic web fundamentals
- **JavaScript**: Learned the language that makes websites interactive
- **Frameworks**: Explored React, Vue, and Angular

## The Learning Process

### Month 1-3: Fundamentals
\`\`\`html
<!-- My first HTML -->
<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
\`\`\`

### Month 4-6: JavaScript Deep Dive
\`\`\`javascript
// Learning functions
function greetUser(name) {
    return \`Hello, \${name}!\`;
}

// Arrow functions
const greetUserArrow = (name) => \`Hello, \${name}!\`;
\`\`\`

### Month 7-12: React and Modern Development
- **Component-based architecture**
- **State management**
- **API integration**
- **Testing strategies**

## Challenges Faced

### 1. Imposter Syndrome
> "Am I really cut out for this?"

This was a constant battle. The tech industry can feel intimidating, but remember: everyone started somewhere.

### 2. Information Overwhelm
- Too many frameworks
- Constantly changing landscape
- Tutorial hell

### 3. Job Market Competition
- Hundreds of applicants per position
- Need to stand out
- Continuous learning required

## Key Learnings

### Technical Skills
1. **Focus on fundamentals** before frameworks
2. **Build projects** to apply knowledge
3. **Contribute to open source**
4. **Write about your journey**

### Soft Skills
1. **Problem-solving mindset**
2. **Communication skills**
3. **Team collaboration**
4. **Continuous learning**

## Current Status

### What I'm Working On
- **Full-stack development** with Next.js
- **Database design** and optimization
- **DevOps** and deployment strategies
- **Mentoring** other beginners

### Future Goals
- **Specialize** in a particular area
- **Contribute** to major open source projects
- **Speak** at conferences
- **Start** my own company

## Advice for Beginners

### 1. Start Small
Don't try to learn everything at once. Pick one technology and master it.

### 2. Build Projects
Theory is great, but practice is essential. Build real projects that solve real problems.

### 3. Join Communities
- **Discord servers**
- **Reddit communities**
- **Local meetups**
- **Online forums**

### 4. Don't Compare
Everyone's journey is different. Focus on your own progress and celebrate small wins.

## Resources That Helped

### Books
- "You Don't Know JS" by Kyle Simpson
- "Clean Code" by Robert Martin
- "The Pragmatic Programmer" by Hunt & Thomas

### Online Courses
- FreeCodeCamp
- The Odin Project
- Scrimba
- YouTube tutorials

### Tools
- **VS Code** with extensions
- **Git** for version control
- **Chrome DevTools** for debugging
- **Postman** for API testing

## Conclusion

The journey into web development is challenging but incredibly rewarding. It's a field that's constantly evolving, which means there's always something new to learn.

Remember: **Every expert was once a beginner.** Don't be afraid to start, and don't give up when things get tough.

---

*What's your development journey been like? I'd love to hear your story in the comments below!*`,
            slug: "journey-web-development",
            published: true,
          },
          {
            title:
              "The Art of UI/UX Design: Creating Beautiful and Functional Interfaces",
            content: `# The Art of UI/UX Design: Creating Beautiful and Functional Interfaces

Design is not just about making things look pretty—it's about creating experiences that are both beautiful and functional. In this comprehensive guide, we'll explore the principles, tools, and techniques that make great UI/UX design.

## Understanding UI vs UX

### User Interface (UI)
UI focuses on the **visual elements** that users interact with:
- Buttons, forms, and navigation
- Color schemes and typography
- Layout and spacing
- Icons and imagery

### User Experience (UX)
UX focuses on the **overall experience**:
- User research and testing
- Information architecture
- User flows and journeys
- Accessibility and usability

## Design Principles

### 1. Hierarchy
Create visual hierarchy through:
- **Size**: Larger elements draw more attention
- **Color**: Contrast creates emphasis
- **Spacing**: White space guides the eye
- **Typography**: Different weights and sizes

### 2. Consistency
Maintain consistency across:
- **Color palette**: Stick to a defined set of colors
- **Typography**: Use consistent font families and sizes
- **Spacing**: Apply consistent margins and padding
- **Components**: Reuse design patterns

### 3. Accessibility
Design for everyone:
- **Color contrast**: Ensure sufficient contrast ratios
- **Text size**: Use readable font sizes
- **Keyboard navigation**: Support keyboard-only users
- **Screen readers**: Provide proper alt text and labels

## Design Process

### 1. Research Phase
\`\`\`
User Research → Personas → User Stories → Requirements
\`\`\`

**Key Activities:**
- User interviews and surveys
- Competitive analysis
- Stakeholder interviews
- Analytics review

### 2. Ideation Phase
\`\`\`
Brainstorming → Sketching → Wireframing → Prototyping
\`\`\`

**Tools to Use:**
- **Figma**: Collaborative design tool
- **Sketch**: Mac-based design tool
- **Adobe XD**: Cross-platform design tool
- **Pen and paper**: Quick ideation

### 3. Design Phase
\`\`\`
Visual Design → Component Library → Design System
\`\`\`

**Design System Components:**
- **Atoms**: Basic elements (buttons, inputs)
- **Molecules**: Simple combinations (search bar)
- **Organisms**: Complex components (header, footer)
- **Templates**: Page layouts
- **Pages**: Final designs

## Color Theory

### Color Psychology
- **Red**: Energy, urgency, passion
- **Blue**: Trust, stability, professionalism
- **Green**: Growth, nature, success
- **Yellow**: Optimism, creativity, warmth
- **Purple**: Luxury, creativity, mystery

### Color Schemes
\`\`\`css
/* Monochromatic */
:root {
  --primary: #3B82F6;
  --primary-light: #60A5FA;
  --primary-dark: #1D4ED8;
}

/* Complementary */
:root {
  --primary: #3B82F6;
  --secondary: #F59E0B;
}

/* Analogous */
:root {
  --primary: #3B82F6;
  --secondary: #8B5CF6;
  --tertiary: #06B6D4;
}
\`\`\`

## Typography

### Font Selection
**For Headings:**
- **Sans-serif**: Modern, clean (Inter, Roboto)
- **Serif**: Traditional, readable (Merriweather, Lora)

**For Body Text:**
- **Sans-serif**: Easy to read (Open Sans, Source Sans Pro)
- **Monospace**: Code and data (Fira Code, JetBrains Mono)

### Typography Scale
\`\`\`css
/* Modular scale */
h1 { font-size: 2.5rem; }    /* 40px */
h2 { font-size: 2rem; }      /* 32px */
h3 { font-size: 1.5rem; }    /* 24px */
h4 { font-size: 1.25rem; }   /* 20px */
body { font-size: 1rem; }    /* 16px */
small { font-size: 0.875rem; } /* 14px */
\`\`\`

## Layout Principles

### Grid Systems
\`\`\`css
/* 12-column grid */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-6 {
  grid-column: span 6;
}
\`\`\`

### Spacing System
\`\`\`css
/* Consistent spacing scale */
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
}
\`\`\`

## Mobile-First Design

### Responsive Breakpoints
\`\`\`css
/* Mobile first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
\`\`\`

### Touch Targets
- **Minimum size**: 44px × 44px
- **Spacing**: 8px between touch targets
- **Visual feedback**: Clear pressed states

## Design Tools

### Design Software
1. **Figma**: Collaborative, web-based
2. **Sketch**: Mac-only, powerful plugins
3. **Adobe XD**: Cross-platform, good for prototyping
4. **InVision**: Prototyping and collaboration

### Prototyping Tools
1. **Framer**: Advanced animations
2. **Principle**: Mac-based animation tool
3. **ProtoPie**: Mobile prototyping
4. **Marvel**: Simple prototyping

### User Testing
1. **UserTesting**: Remote user testing
2. **Maze**: Unmoderated testing
3. **Hotjar**: Heatmaps and recordings
4. **Google Analytics**: User behavior data

## Common Design Mistakes

### 1. Inconsistent Spacing
❌ **Bad**: Random margins and padding
✅ **Good**: Systematic spacing scale

### 2. Poor Color Contrast
❌ **Bad**: Light gray text on white background
✅ **Good**: Sufficient contrast ratios (4.5:1 minimum)

### 3. Cluttered Interfaces
❌ **Bad**: Too many elements competing for attention
✅ **Good**: Clear hierarchy and white space

### 4. Inconsistent Components
❌ **Bad**: Different button styles throughout
✅ **Good**: Reusable component library

## Design Trends 2024

### 1. Neumorphism
Soft, extruded plastic look with subtle shadows and highlights.

### 2. Glassmorphism
Frosted glass effect with transparency and blur.

### 3. Dark Mode
Increased focus on dark themes and reduced eye strain.

### 4. Micro-interactions
Subtle animations that provide feedback and delight users.

## Conclusion

Great UI/UX design is about understanding your users and creating experiences that are both beautiful and functional. It's a balance of art and science, creativity and research.

Remember: **Good design is invisible**—users shouldn't have to think about how to use your interface.

---

*What design principles do you find most important? Share your thoughts in the comments below!*`,
            slug: "art-ui-ux-design",
            published: true,
          },
          {
            title: "Healthy Living: A Complete Guide to Wellness and Fitness",
            content: `# Healthy Living: A Complete Guide to Wellness and Fitness

In today's fast-paced world, maintaining a healthy lifestyle can feel overwhelming. This comprehensive guide will help you create sustainable habits that promote both physical and mental well-being.

## The Foundation of Health

### Physical Health
Physical health is the cornerstone of overall wellness. It includes:
- **Cardiovascular fitness**: Heart and lung health
- **Muscular strength**: Building and maintaining muscle mass
- **Flexibility**: Range of motion and mobility
- **Body composition**: Healthy ratio of muscle to fat

### Mental Health
Mental health is equally important:
- **Stress management**: Coping with daily pressures
- **Emotional regulation**: Understanding and managing emotions
- **Cognitive function**: Mental clarity and focus
- **Social connections**: Meaningful relationships

## Nutrition Fundamentals

### Macronutrients
Understanding the three main macronutrients:

#### 1. Carbohydrates (4 calories/gram)
- **Simple carbs**: Quick energy (fruits, honey)
- **Complex carbs**: Sustained energy (whole grains, vegetables)
- **Recommended**: 45-65% of daily calories

#### 2. Proteins (4 calories/gram)
- **Complete proteins**: All essential amino acids (meat, fish, eggs)
- **Incomplete proteins**: Missing some amino acids (beans, nuts)
- **Recommended**: 10-35% of daily calories

#### 3. Fats (9 calories/gram)
- **Saturated fats**: Solid at room temperature (butter, coconut oil)
- **Unsaturated fats**: Liquid at room temperature (olive oil, avocados)
- **Recommended**: 20-35% of daily calories

### Micronutrients
Essential vitamins and minerals:

#### Vitamins
- **Vitamin A**: Eye health and immune function
- **Vitamin C**: Immune system and collagen production
- **Vitamin D**: Bone health and immune function
- **B Vitamins**: Energy metabolism and brain function

#### Minerals
- **Calcium**: Bone and teeth health
- **Iron**: Oxygen transport in blood
- **Magnesium**: Muscle and nerve function
- **Zinc**: Immune system and wound healing

## Exercise and Fitness

### Types of Exercise

#### 1. Cardiovascular Exercise
**Benefits:**
- Improved heart health
- Increased endurance
- Better mood and energy
- Weight management

**Examples:**
- Walking, running, cycling
- Swimming, dancing
- Sports and recreational activities

**Recommendation:** 150 minutes moderate or 75 minutes vigorous per week

#### 2. Strength Training
**Benefits:**
- Increased muscle mass
- Stronger bones
- Better metabolism
- Improved posture

**Examples:**
- Weight lifting
- Bodyweight exercises
- Resistance bands
- Functional movements

**Recommendation:** 2-3 times per week

#### 3. Flexibility Training
**Benefits:**
- Improved range of motion
- Reduced injury risk
- Better posture
- Stress relief

**Examples:**
- Yoga
- Stretching
- Pilates
- Tai Chi

**Recommendation:** Daily stretching, 2-3 yoga sessions per week

### Creating an Exercise Routine

#### Beginner Program (Weeks 1-4)
**Monday:** 20-minute walk + 10-minute stretching
**Tuesday:** Rest or light yoga
**Wednesday:** 20-minute walk + bodyweight exercises
**Thursday:** Rest or light yoga
**Friday:** 20-minute walk + 10-minute stretching
**Saturday:** 30-minute recreational activity
**Sunday:** Rest

#### Intermediate Program (Weeks 5-12)
**Monday:** 30-minute cardio + strength training
**Tuesday:** 20-minute yoga or stretching
**Wednesday:** 30-minute cardio + strength training
**Thursday:** 20-minute yoga or stretching
**Friday:** 30-minute cardio + strength training
**Saturday:** 45-minute recreational activity
**Sunday:** Rest or light stretching

## Mental Health and Wellness

### Stress Management
Chronic stress can have serious health consequences:

#### Physical Effects
- Increased blood pressure
- Weakened immune system
- Digestive problems
- Sleep disturbances

#### Mental Effects
- Anxiety and depression
- Difficulty concentrating
- Irritability and mood swings
- Burnout and fatigue

### Stress Reduction Techniques

#### 1. Mindfulness and Meditation
**Benefits:**
- Reduced anxiety and depression
- Improved focus and concentration
- Better emotional regulation
- Enhanced self-awareness

**Getting Started:**
- Start with 5-10 minutes daily
- Use guided meditation apps
- Practice deep breathing exercises
- Try body scan meditations

#### 2. Physical Activity
**Benefits:**
- Release of endorphins
- Improved sleep quality
- Better stress resilience
- Enhanced mood

**Activities:**
- Walking in nature
- Dancing
- Swimming
- Team sports

#### 3. Social Connections
**Benefits:**
- Emotional support
- Reduced loneliness
- Shared experiences
- Sense of belonging

**Ways to Connect:**
- Join clubs or groups
- Volunteer in your community
- Maintain close friendships
- Participate in group activities

## Sleep and Recovery

### Importance of Sleep
Sleep is essential for:
- **Physical recovery**: Muscle repair and growth
- **Mental clarity**: Memory consolidation
- **Immune function**: Fighting off illness
- **Emotional regulation**: Managing stress and mood

### Sleep Hygiene Tips
1. **Consistent schedule**: Go to bed and wake up at the same time
2. **Dark environment**: Use blackout curtains or eye mask
3. **Cool temperature**: 65-68°F (18-20°C) is optimal
4. **No screens**: Avoid devices 1 hour before bed
5. **Relaxing routine**: Reading, meditation, or gentle stretching

### Recovery Strategies
- **Active recovery**: Light movement on rest days
- **Passive recovery**: Massage, sauna, or hot baths
- **Nutrition**: Proper fueling for recovery
- **Hydration**: Adequate water intake

## Building Sustainable Habits

### The 1% Rule
Small, consistent improvements lead to significant results over time:
- **Week 1**: Add one serving of vegetables daily
- **Week 2**: Take a 10-minute walk daily
- **Week 3**: Drink one extra glass of water
- **Week 4**: Practice 5 minutes of meditation

### Habit Stacking
Attach new habits to existing ones:
- **After brushing teeth**: Do 10 squats
- **Before coffee**: Drink a glass of water
- **After dinner**: Take a 10-minute walk
- **Before bed**: Write in a gratitude journal

### Environment Design
Make healthy choices easier:
- **Keep healthy snacks visible**
- **Remove tempting foods from sight**
- **Set up a dedicated exercise space**
- **Prepare workout clothes the night before**

## Common Challenges and Solutions

### Challenge 1: Lack of Time
**Solution:** Start with micro-habits
- 2-minute meditation
- 5-minute walk
- 1-minute plank
- 3-minute stretching

### Challenge 2: Motivation
**Solution:** Focus on systems, not goals
- Create a routine
- Track progress
- Celebrate small wins
- Find accountability partners

### Challenge 3: Perfectionism
**Solution:** Embrace progress over perfection
- 80% consistency is better than 100% perfection
- Learn from setbacks
- Adjust and continue
- Be kind to yourself

## Technology and Health

### Fitness Apps
- **MyFitnessPal**: Nutrition tracking
- **Strava**: Exercise logging
- **Headspace**: Meditation and mindfulness
- **Sleep Cycle**: Sleep tracking

### Wearable Devices
- **Fitness trackers**: Step counting and activity monitoring
- **Smartwatches**: Heart rate and sleep tracking
- **Heart rate monitors**: Exercise intensity
- **Sleep trackers**: Sleep quality analysis

### Online Resources
- **YouTube**: Free workout videos
- **Podcasts**: Health and wellness content
- **Online courses**: Nutrition and fitness education
- **Virtual coaching**: Remote personal training

## Long-term Health Goals

### Setting SMART Goals
- **Specific**: Clear and well-defined
- **Measurable**: Quantifiable outcomes
- **Achievable**: Realistic and attainable
- **Relevant**: Aligned with your values
- **Time-bound**: Specific timeline

### Examples of SMART Goals
1. **Walk 10,000 steps daily for 30 days**
2. **Eat 5 servings of vegetables daily for 3 months**
3. **Complete a 5K run in 6 months**
4. **Meditate for 10 minutes daily for 2 months**

## Conclusion

Healthy living is a journey, not a destination. It's about making consistent, sustainable choices that support your physical, mental, and emotional well-being.

Remember: **Progress, not perfection.** Every small step toward better health is a victory worth celebrating.

Start with one small change today, and build from there. Your future self will thank you.

---

*What's one healthy habit you'd like to start this week? Share your goals in the comments below!*`,
            slug: "healthy-living-wellness-fitness",
            published: true,
          },
          {
            title: "Travel Photography: Capturing the World Through Your Lens",
            content: `# Travel Photography: Capturing the World Through Your Lens

Travel photography is more than just taking pictures—it's about telling stories, preserving memories, and sharing the beauty of our world. This comprehensive guide will help you capture stunning travel photos that truly represent your adventures.

## The Art of Travel Photography

### What Makes Great Travel Photos?
- **Storytelling**: Every photo should tell a story
- **Emotion**: Capture the feeling of a moment
- **Composition**: Strong visual elements and balance
- **Lighting**: Understanding and using natural light
- **Authenticity**: Genuine moments and experiences

### Types of Travel Photography
1. **Landscape**: Natural scenery and vistas
2. **Street**: Urban life and culture
3. **Portrait**: People and their stories
4. **Architecture**: Buildings and structures
5. **Food**: Culinary experiences
6. **Wildlife**: Animals in their natural habitat

## Essential Equipment

### Camera Bodies
#### DSLR Cameras
**Advantages:**
- Excellent image quality
- Wide range of lenses
- Long battery life
- Durability

**Best for:** Serious photographers who want maximum control

#### Mirrorless Cameras
**Advantages:**
- Compact and lightweight
- Excellent image quality
- Advanced autofocus
- Video capabilities

**Best for:** Travelers who want quality without bulk

#### Smartphone Cameras
**Advantages:**
- Always with you
- Easy sharing
- Good for quick shots
- No additional weight

**Best for:** Casual photography and social media

### Essential Lenses

#### Wide-Angle Lens (14-24mm)
**Use for:**
- Landscapes and cityscapes
- Architecture
- Interior shots
- Group photos

**Tips:**
- Watch for distortion at edges
- Use for dramatic perspectives
- Great for cramped spaces

#### Standard Zoom (24-70mm)
**Use for:**
- General travel photography
- Street photography
- Portraits
- Versatile everyday use

**Tips:**
- Most versatile lens
- Good for beginners
- Covers most situations

#### Telephoto Lens (70-200mm)
**Use for:**
- Wildlife photography
- Distant subjects
- Compressed perspectives
- Detail shots

**Tips:**
- Requires steady hands
- Great for candid shots
- Isolates subjects from background

### Accessories

#### Tripods
- **Travel tripods**: Lightweight and compact
- **Gorilla pods**: Flexible positioning
- **Monopods**: Quick setup and mobility

#### Filters
- **Polarizing filter**: Reduces glare and enhances colors
- **Neutral density**: Long exposures in bright light
- **UV filter**: Protection for your lens

#### Storage
- **Memory cards**: High-speed, high-capacity
- **External hard drives**: Backup and storage
- **Cloud storage**: Online backup solutions

## Composition Techniques

### Rule of Thirds
Divide your frame into nine equal parts using two horizontal and two vertical lines. Place important elements along these lines or at their intersections.

\`\`\`
|-------|-------|-------|
|   •   |       |       |
|-------|-------|-------|
|       |   •   |       |
|-------|-------|-------|
|       |       |   •   |
\`\`\`

### Leading Lines
Use natural or man-made lines to guide the viewer's eye through your image:
- **Roads and paths**
- **Rivers and streams**
- **Railings and fences**
- **Architectural elements**

### Framing
Use elements in your environment to frame your subject:
- **Doorways and windows**
- **Trees and branches**
- **Architectural features**
- **Natural formations**

### Depth of Field
Control what's in focus to create visual impact:
- **Shallow depth**: Isolate your subject
- **Deep depth**: Show everything in focus
- **Bokeh**: Beautiful background blur

## Lighting Mastery

### Golden Hour
The hour after sunrise and before sunset provides:
- **Warm, soft light**
- **Long shadows**
- **Beautiful colors**
- **Flattering portraits**

### Blue Hour
The time before sunrise and after sunset offers:
- **Cool, blue tones**
- **City lights**
- **Dramatic skies**
- **Moody atmosphere**

### Harsh Light
Midday sun can be challenging:
- **Use shadows creatively**
- **Find shade for portraits**
- **Shoot details and textures**
- **Use fill flash**

### Indoor Lighting
- **Natural window light**
- **Candlelight and warm tones**
- **Mixed lighting situations**
- **Low light techniques**

## Travel Photography Tips

### Research Your Destination
- **Study the location**: Know what to expect
- **Check weather**: Plan for conditions
- **Research local customs**: Respect cultural sensitivities
- **Find unique angles**: Avoid cliché shots

### Timing Your Shots
- **Early morning**: Fewer crowds, better light
- **Late afternoon**: Golden hour magic
- **Evening**: City lights and atmosphere
- **Weather changes**: Dramatic skies

### Interacting with Locals
- **Learn basic phrases**: "May I take your photo?"
- **Show respect**: Ask permission for portraits
- **Be genuine**: Build connections
- **Share your photos**: Offer to send copies

### Safety Considerations
- **Protect your gear**: Use camera bags and straps
- **Be aware**: Watch for pickpockets
- **Insure equipment**: Travel insurance for gear
- **Backup photos**: Multiple storage methods

## Post-Processing Workflow

### Software Options
- **Adobe Lightroom**: Professional editing
- **Adobe Photoshop**: Advanced manipulation
- **Capture One**: High-end processing
- **Luminar**: AI-powered editing
- **Mobile apps**: Snapseed, VSCO, Lightroom Mobile

### Basic Editing Steps
1. **Import and organize**
2. **Crop and straighten**
3. **Adjust exposure and contrast**
4. **Enhance colors and saturation**
5. **Sharpen and reduce noise**
6. **Export for different uses**

### Presets and Styles
- **Create your own**: Develop consistent look
- **Use presets**: Quick editing solutions
- **Batch processing**: Edit multiple photos
- **Mobile editing**: Quick social media posts

## Storytelling Through Photography

### Photo Series
Create cohesive stories:
- **Daily life**: A day in the life of...
- **Cultural traditions**: Festivals and ceremonies
- **Food journey**: From market to table
- **Architecture tour**: Buildings and structures

### Caption Writing
- **Tell the story**: What's happening in the photo
- **Include context**: Where, when, why
- **Share emotions**: How you felt
- **Add details**: Interesting facts

### Social Media Strategy
- **Instagram**: Visual storytelling platform
- **Blog posts**: Longer-form content
- **YouTube**: Video content and tutorials
- **Print**: Physical photo books

## Advanced Techniques

### Long Exposure
- **Waterfalls**: Smooth, silky water
- **City lights**: Light trails and movement
- **Stars**: Astrophotography
- **Crowds**: Ghostly, blurred people

### HDR Photography
- **High contrast scenes**: Bright and dark areas
- **Architecture**: Interior and exterior
- **Landscapes**: Dramatic skies and foregrounds
- **Sunset/sunrise**: Maximum detail

### Panoramic Photography
- **Wide landscapes**: Sweeping vistas
- **City skylines**: Urban panoramas
- **Interior spaces**: Large rooms
- **Vertical panoramas**: Tall buildings

### Time-lapse Photography
- **Sunrise/sunset**: Changing light
- **Clouds**: Moving weather patterns
- **Crowds**: Busy intersections
- **Construction**: Building progress

## Building Your Portfolio

### Selecting Your Best Work
- **Quality over quantity**: Choose your strongest images
- **Variety**: Show different styles and subjects
- **Consistency**: Maintain your personal style
- **Storytelling**: Images that tell stories

### Online Presence
- **Website**: Professional portfolio
- **Social media**: Regular posting
- **Blog**: Behind-the-scenes content
- **Print sales**: Physical products

### Networking
- **Photography groups**: Local and online communities
- **Workshops**: Learn from others
- **Exhibitions**: Show your work
- **Collaborations**: Work with other creatives

## Common Mistakes to Avoid

### Technical Mistakes
- **Overexposure**: Blown-out highlights
- **Underexposure**: Dark, muddy images
- **Camera shake**: Blurry photos
- **Poor focus**: Out-of-focus subjects

### Composition Mistakes
- **Centered subjects**: Boring compositions
- **Cluttered backgrounds**: Distracting elements
- **Cut-off subjects**: Incomplete framing
- **Horizon issues**: Crooked horizons

### Travel Mistakes
- **Only tourist spots**: Missing authentic experiences
- **Rushing**: Not taking time to compose
- **Not interacting**: Missing human stories
- **Overpacking**: Too much gear

## Conclusion

Travel photography is a journey of discovery, both of the world around you and of your own creative vision. It's about more than just capturing images—it's about preserving memories, sharing experiences, and connecting with people and places.

Remember: **The best camera is the one you have with you.** Don't let equipment limitations stop you from capturing the world around you.

Start with the basics, practice regularly, and most importantly, enjoy the process. Every photo you take is a step forward in your photographic journey.

---

*What's your favorite travel photography tip? Share your experiences in the comments below!*`,
            slug: "travel-photography-guide",
            published: true,
          },
        ])
        .returning();

      // Create post-category relationships
      logger.log("🔗 Creating post-category relationships...");
      await db.insert(postCategories).values([
        // Post 1: Technology + Tutorials
        {
          postId: post1.id,
          categoryId: techCategory.id,
        },
        {
          postId: post1.id,
          categoryId: tutorialCategory.id,
        },
        // Post 2: Technology + Tutorials + Design
        {
          postId: post2.id,
          categoryId: techCategory.id,
        },
        {
          postId: post2.id,
          categoryId: tutorialCategory.id,
        },
        {
          postId: post2.id,
          categoryId: designCategory.id,
        },
        // Post 3: Lifestyle + Tutorials
        {
          postId: post3.id,
          categoryId: lifestyleCategory.id,
        },
        {
          postId: post3.id,
          categoryId: tutorialCategory.id,
        },
        // Post 4: Design + Business
        {
          postId: post4.id,
          categoryId: designCategory.id,
        },
        {
          postId: post4.id,
          categoryId: businessCategory.id,
        },
        // Post 5: Health + Lifestyle
        {
          postId: post5.id,
          categoryId: healthCategory.id,
        },
        {
          postId: post5.id,
          categoryId: lifestyleCategory.id,
        },
        // Post 6: Travel + Food
        {
          postId: post6.id,
          categoryId: travelCategory.id,
        },
        {
          postId: post6.id,
          categoryId: foodCategory.id,
        },
      ]);

      logger.log("✅ Database seeded successfully!");
      logger.log(`📊 Created:`);
      logger.log(`   - ${8} categories`);
      logger.log(`   - ${6} posts`);
      logger.log(`   - ${12} post-category relationships`);
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
