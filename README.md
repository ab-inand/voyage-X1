# VoyageX - Next-Gen Travel Platform

A futuristic travel platform that combines immersive 3D experiences, AI personalization, and interactive storytelling to revolutionize the way people plan and experience travel.

## Features

- 🌍 Interactive 3D Globe Explorer
- 🤖 AI-Powered Travel Concierge
- 🎮 Virtual Reality Previews
- 📱 Responsive Design
- 🎨 Modern UI with Glassmorphism
- ⚡ Smooth Animations
- 🔒 Secure Authentication
- 💎 NFT Integration

## Tech Stack

- Next.js 14
- TypeScript
- React Three Fiber / Drei
- Framer Motion
- Tailwind CSS
- Headless UI
- Prisma ORM
- JWT Authentication
- Nodemailer

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for database)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voyax.git
cd voyax
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in the required environment variables in the `.env` file:
- `DATABASE_URL`: Your PostgreSQL database URL
- `JWT_SECRET`: Secret key for JWT authentication
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   └── (routes)/       # Page routes
├── components/         # Reusable components
├── lib/               # Utility functions and configurations
├── prisma/            # Database schema and migrations
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Three.js for 3D graphics
- Framer Motion for animations
- Tailwind CSS for styling
- Next.js team for the amazing framework
- Prisma team for the database ORM
