# Blog Application

A modern blog application built with Next.js 15, TypeScript, and Drizzle ORM. Features include markdown editing, category management, and server-side filtering.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: Neon Database (Cloud PostgreSQL) with Drizzle ORM
- **Markdown Editor**: Rich text editing with live preview
- **Category Management**: Organize posts with categories
- **Search & Filtering**: Server-side search and multiple category filtering
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Neon Database](https://neon.tech/) account (for cloud PostgreSQL)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bhaveshbalendra/blog.git
   cd blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database (Neon Database)
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

   # Next.js
   NEXT_ENV="development"
   ```

4. **Set up Neon Database**

   - Create a free account at [Neon.tech](https://neon.tech/)
   - Create a new project
   - Copy the connection string from your Neon dashboard
   - Paste it as `DATABASE_URL` in your `.env` file

## 🗄️ Database Setup (Neon Database)

### 1. Generate Database Schema

```bash
npm run db:generate
```

### 2. Run Database Migrations

```bash
npm run db:migrate
```

### 3. Seed the Database

```bash
npm run db:seed
```

This will create:

- 3 sample categories (Technology, Lifestyle, Tutorials)
- 3 sample posts with proper category associations
- 5 post-category relationships

### 4. (Optional) Open Database Studio

```bash
npm run db:studio
```

> **Note**: Neon Database provides a free tier with 0.5GB storage and 10GB transfer per month, perfect for development and small projects.

### Why Neon Database?

- **🌐 Cloud-Native**: No local PostgreSQL installation required
- **💰 Free Tier**: Generous free tier for development and small projects
- **⚡ Fast**: Optimized for serverless and edge computing
- **🔒 Secure**: Built-in SSL and security features
- **📊 Monitoring**: Built-in query monitoring and performance insights
- **🔄 Auto-scaling**: Automatically scales based on usage

## 🚀 Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Admin dashboard
│   └── categories/         # Category management
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── MarkdownEditor.tsx # Rich text editor
│   └── Navigation.tsx     # Site navigation
├── db/                    # Database configuration
│   ├── schemas/          # Drizzle schemas
│   └── seed.ts          # Database seeding
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api/             # API utilities
│   ├── trpc/            # tRPC configuration
│   └── store/           # Zustand stores
└── config/              # Configuration files
```

## 🎯 Available Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Start development server        |
| `npm run build`       | Build for production            |
| `npm run start`       | Start production server         |
| `npm run lint`        | Run ESLint                      |
| `npm run db:generate` | Generate database migrations    |
| `npm run db:migrate`  | Run database migrations         |
| `npm run db:push`     | Push schema changes to database |
| `npm run db:seed`     | Seed database with sample data  |
| `npm run db:studio`   | Open Drizzle Studio             |

## 🗃️ Database Schema

### Posts Table

- `id` - UUID primary key
- `title` - Post title
- `content` - Post content (markdown)
- `slug` - URL-friendly identifier
- `published` - Publication status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Categories Table

- `id` - UUID primary key
- `name` - Category name
- `description` - Category description
- `slug` - URL-friendly identifier
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Post Categories Table (Junction)

- `id` - UUID primary key
- `postId` - Foreign key to posts
- `categoryId` - Foreign key to categories
- `createdAt` - Creation timestamp

## 🔧 Key Features

### Markdown Editor

- Live preview
- Syntax highlighting
- Auto-save functionality
- Category assignment

### Category Management

- Create, edit, and delete categories
- Assign multiple categories to posts
- Filter posts by category

### Search & Filtering

- Server-side search across title and content
- Multiple category filtering (select multiple categories at once)
- Published/draft status filtering
- Pagination support
- Visual indicators for selected filters

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 🆘 Troubleshooting

### Database Connection Issues

- Verify your Neon Database connection string in `.env`
- Check if your Neon project is active (not paused)
- Ensure your Neon database credentials are correct
- Check your internet connection

### Build Issues

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

**Happy Blogging! 🎉**
