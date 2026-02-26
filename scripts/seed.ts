import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
  // Dynamic import AFTER env vars are loaded
  const { db } = await import('../lib/db');
  const { courses } = await import('../lib/db/schema');

  console.log('Seeding database...');

  try {
    // Insert sample courses
    const [course1] = await db.insert(courses).values({
      slug: 'viral-telegram-app-mastery',
      title: 'From Zero to Viral: Telegram App Mastery',
      description: 'Comprehensive video course teaching Telegram Mini App development, including source code and implementation guides.',
      priceAmount: 79900, 
      currency: 'usd',
      isPublished: true,
      metadata: {
        totalModules: 12,
        features: ['12 video lessons', 'Source code included']
      }
    }).returning();

    // const [course1] = await db.insert(courses).values({
    //   slug: 'nextjs-fundamentals',
    //   title: 'Next.js Fundamentals',
    //   description: 'Learn the basics of Next.js and build modern web applications',
    //   priceAmount: 4999, // $49.99
    //   currency: 'usd',
    //   isPublished: true,
    //   metadata: {
    //     totalModules: 4,
    //     features: ['15 video lessons', 'Source code included', 'Certificate of completion'],
    //     duration: '8 hours',
    //     level: 'beginner'
    //   }
    // }).returning();

    // const [course2] = await db.insert(courses).values({
    //   slug: 'advanced-react-patterns',
    //   title: 'Advanced React Patterns',
    //   description: 'Master advanced React patterns and best practices',
    //   priceAmount: 7999, // $79.99
    //   currency: 'usd',
    //   isPublished: true,
    //   metadata: {
    //     totalModules: 4,
    //     features: ['20 video lessons', 'Real-world projects', 'Code reviews'],
    //     duration: '12 hours',
    //     level: 'advanced'
    //   }
    // }).returning();

    console.log('Sample courses created!');
    console.log('\nNext steps:');
    console.log('1. Create these products in your Stripe dashboard');
    console.log('2. For each course:');
    console.log('   - Create a product in Stripe');
    console.log('   - Create a one-time price for the product');
    console.log('   - Update the database with stripeProductId and stripePriceId');
    console.log('\nExample SQL to update after creating in Stripe:');
    console.log(`UPDATE courses SET stripe_product_id = 'prod_xxx', stripe_price_id = 'price_xxx' WHERE slug = 'nextjs-fundamentals';`);

    console.log('\nSeeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });