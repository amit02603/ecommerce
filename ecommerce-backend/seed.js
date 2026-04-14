const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("./src/models/Category");
const Product = require("./src/models/Product");
const User = require("./src/models/User");

// Sample categories
const categories = [
  { name: "Electronics", description: "Phones, laptops, gadgets and more" },
  { name: "Fashion", description: "Clothing, shoes and accessories" },
  { name: "Home & Kitchen", description: "Furniture, appliances and decor" },
  { name: "Books", description: "Fiction, non-fiction and educational books" },
  { name: "Sports", description: "Equipment and sportswear" },
  { name: "Beauty", description: "Skincare, haircare and cosmetics" },
];

// We will build the products array after categories are created
// because each product needs a valid category ObjectId
async function buildProducts(categoryMap) {
  return [
    // Electronics
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      description:
        "Industry-leading noise cancellation headphones with 30-hour battery life. Features multipoint connection, speak-to-chat technology, and exceptional call quality. Foldable design for easy portability.",
      price: 29990,
      discountedPrice: 24999,
      category: categoryMap["Electronics"],
      stock: 45,
      ratings: 4.8,
      numReviews: 312,
      images: [
        {
          public_id: "sample_headphones_1",
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Rahul Sharma",
          rating: 5,
          comment:
            "Absolutely stunning sound quality. The noise cancellation is the best I have ever heard.",
        },
        {
          user: new mongoose.Types.ObjectId(),
          name: "Priya Mehta",
          rating: 5,
          comment: "Battery life is incredible. Using it for 3 weeks and very happy.",
        },
      ],
    },
    {
      name: "Apple iPad Pro 11-inch M4",
      description:
        "The ultimate iPad experience with M4 chip. Features a stunning Ultra Retina XDR display, Apple Pencil Pro support, and all-day battery life. Perfect for creative professionals and students.",
      price: 99900,
      discountedPrice: 94999,
      category: categoryMap["Electronics"],
      stock: 20,
      ratings: 4.9,
      numReviews: 198,
      images: [
        {
          public_id: "sample_ipad_1",
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Arjun Nair",
          rating: 5,
          comment: "The M4 chip is blazingly fast. Perfect for video editing on the go.",
        },
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      description:
        "The most powerful Galaxy ever with a built-in S Pen, 200MP camera system, and Snapdragon 8 Gen 3 processor. Features a 6.8-inch Dynamic AMOLED display and 5000mAh battery.",
      price: 134999,
      discountedPrice: 119999,
      category: categoryMap["Electronics"],
      stock: 30,
      ratings: 4.7,
      numReviews: 445,
      images: [
        {
          public_id: "sample_galaxy_1",
          url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Sneha Joshi",
          rating: 5,
          comment: "Camera quality is mind-blowing. The S Pen makes it so much more useful.",
        },
      ],
    },
    {
      name: "LG 27-inch 4K Monitor",
      description:
        "UltraFine 4K IPS display with 99% sRGB colour accuracy. Features USB-C connectivity, HDR400 support, and an ergonomic height-adjustable stand. Ideal for designers and content creators.",
      price: 45999,
      discountedPrice: 38999,
      category: categoryMap["Electronics"],
      stock: 15,
      ratings: 4.6,
      numReviews: 87,
      images: [
        {
          public_id: "sample_monitor_1",
          url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
        },
      ],
      reviews: [],
    },

    // Fashion
    {
      name: "Men's Premium Oxford Shirt",
      description:
        "Crafted from 100% Egyptian cotton, this classic Oxford shirt offers a relaxed fit perfect for both office and casual wear. Available in multiple colours with a button-down collar.",
      price: 2499,
      discountedPrice: 1799,
      category: categoryMap["Fashion"],
      stock: 120,
      ratings: 4.3,
      numReviews: 56,
      images: [
        {
          public_id: "sample_shirt_1",
          url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Vikram Singh",
          rating: 4,
          comment: "Great quality fabric. Fits true to size and looks sharp.",
        },
      ],
    },
    {
      name: "Women's Ethnic Kurta Set",
      description:
        "Beautiful hand-block printed kurta set in pure cotton fabric. Includes kurta, palazzo pants, and dupatta. Light and comfortable for all-day wear at festive occasions.",
      price: 3299,
      discountedPrice: 2499,
      category: categoryMap["Fashion"],
      stock: 80,
      ratings: 4.5,
      numReviews: 142,
      images: [
        {
          public_id: "sample_kurta_1",
          url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Ananya Reddy",
          rating: 5,
          comment: "Absolutely loved this kurta set. The print is even more beautiful in person.",
        },
      ],
    },
    {
      name: "Nike Air Max 270 Running Shoes",
      description:
        "Inspired by Air Max icons of the past, the Nike Air Max 270 features a large Max Air heel unit for all-day comfort. Breathable mesh upper with foam midsole for a cushioned ride.",
      price: 12995,
      discountedPrice: 9999,
      category: categoryMap["Fashion"],
      stock: 60,
      ratings: 4.6,
      numReviews: 230,
      images: [
        {
          public_id: "sample_shoes_1",
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        },
      ],
      reviews: [],
    },

    // Home & Kitchen
    {
      name: "Philips Air Fryer HD9200",
      description:
        "Fry, bake, grill and roast with little to no oil using Rapid Air Technology. 1400W power with 4.1 litre capacity. Features a digital touchscreen and 7 preset cooking programs.",
      price: 9999,
      discountedPrice: 7499,
      category: categoryMap["Home & Kitchen"],
      stock: 35,
      ratings: 4.4,
      numReviews: 389,
      images: [
        {
          public_id: "sample_airfryer_1",
          url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Pooja Iyer",
          rating: 5,
          comment: "Best kitchen purchase I ever made. Chicken wings come out perfect every time.",
        },
      ],
    },
    {
      name: "Wooden Coffee Table",
      description:
        "Solid sheesham wood coffee table with a natural finish. Features shelf storage below for books and magazines. Dimensions: 120 x 60 x 45 cm. Assembly required.",
      price: 15999,
      discountedPrice: 12999,
      category: categoryMap["Home & Kitchen"],
      stock: 12,
      ratings: 4.2,
      numReviews: 48,
      images: [
        {
          public_id: "sample_table_1",
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        },
      ],
      reviews: [],
    },

    // Books
    {
      name: "Atomic Habits by James Clear",
      description:
        "The #1 New York Times bestseller. Learn how tiny changes in behaviour can lead to remarkable results. James Clear reveals the secrets of forming good habits and breaking bad ones.",
      price: 499,
      discountedPrice: 349,
      category: categoryMap["Books"],
      stock: 200,
      ratings: 4.9,
      numReviews: 1247,
      images: [
        {
          public_id: "sample_book_1",
          url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Karan Gupta",
          rating: 5,
          comment: "Life-changing book. The 1% better every day concept completely shifted my mindset.",
        },
        {
          user: new mongoose.Types.ObjectId(),
          name: "Divya Patel",
          rating: 5,
          comment: "Practical, science-backed advice. I have recommended this to everyone I know.",
        },
      ],
    },
    {
      name: "The Psychology of Money by Morgan Housel",
      description:
        "Timeless lessons on wealth, greed, and happiness. Explores the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
      price: 399,
      discountedPrice: 279,
      category: categoryMap["Books"],
      stock: 180,
      ratings: 4.8,
      numReviews: 876,
      images: [
        {
          public_id: "sample_book_2",
          url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
        },
      ],
      reviews: [],
    },

    // Sports
    {
      name: "Decathlon Pull-Up Bar",
      description:
        "Heavy-duty doorframe pull-up bar with foam-padded grips. Supports up to 120 kg. Installs in seconds without drilling. Multi-grip positions for a complete upper body workout.",
      price: 1499,
      discountedPrice: 1199,
      category: categoryMap["Sports"],
      stock: 75,
      ratings: 4.1,
      numReviews: 163,
      images: [
        {
          public_id: "sample_pullup_1",
          url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80",
        },
      ],
      reviews: [],
    },
    {
      name: "Yoga Mat with Alignment Lines",
      description:
        "Premium 6mm thick non-slip yoga mat with alignment lines to improve your form. Made from eco-friendly TPE material. Includes carrying strap. Dimensions: 183 x 61 cm.",
      price: 1299,
      discountedPrice: 899,
      category: categoryMap["Sports"],
      stock: 95,
      ratings: 4.5,
      numReviews: 218,
      images: [
        {
          public_id: "sample_yogamat_1",
          url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Neha Kulkarni",
          rating: 5,
          comment: "The alignment lines are super helpful. Very grippy and comfortable.",
        },
      ],
    },

    // Beauty
    {
      name: "Minimalist 10% Niacinamide Serum",
      description:
        "High-strength vitamin and mineral blemish formula. Controls excess sebum production, reduces the appearance of pores, and brightens skin tone. Suitable for all skin types. 30ml.",
      price: 699,
      discountedPrice: 549,
      category: categoryMap["Beauty"],
      stock: 150,
      ratings: 4.6,
      numReviews: 523,
      images: [
        {
          public_id: "sample_serum_1",
          url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        },
      ],
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          name: "Ishita Bose",
          rating: 5,
          comment: "My skin texture has improved so much in just 3 weeks. Love this serum.",
        },
      ],
    },
    {
      name: "L'Oreal Paris Revitalift Cream",
      description:
        "Anti-ageing day cream with Pro-Retinol and Centella Asiatica. Reduces wrinkles, firms skin, and improves hydration with regular use. SPF 20. Suitable for dry and normal skin. 50ml.",
      price: 999,
      discountedPrice: 749,
      category: categoryMap["Beauty"],
      stock: 90,
      ratings: 4.3,
      numReviews: 312,
      images: [
        {
          public_id: "sample_cream_1",
          url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
        },
      ],
      reviews: [],
    },
  ];
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Wipe existing data so we start fresh every time the seed runs
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing categories and products");

    // insertMany() skips Mongoose pre('save') hooks, so the slug would never be set.
    // We create each category individually so the slug auto-generation hook fires.
    const createdCategories = [];
    for (const catData of categories) {
      const cat = await Category.create(catData);
      createdCategories.push(cat);
    }
    const categoryMap = {};
    createdCategories.forEach(function (cat) {
      categoryMap[cat.name] = cat._id;
    });
    console.log(`Created ${createdCategories.length} categories`);

    // Build the products array now that we have real category IDs
    const products = await buildProducts(categoryMap);

    // Same reason — create products one by one so the slug hook runs
    const createdProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      createdProducts.push(product);
    }
    console.log(`Created ${createdProducts.length} products`);

    // Create a default admin user if one doesn't exist yet
    const existingAdmin = await User.findOne({ email: "admin@shopnest.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Admin",
        email: "admin@shopnest.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Created admin user: admin@shopnest.com / admin123");
    } else {
      console.log("Admin user already exists, skipping");
    }

    console.log("\nDatabase seeded successfully!");
    console.log("You can now browse products on the frontend at http://localhost:3000");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
