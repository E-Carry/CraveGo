import { FoodItem, CustomizationGroup } from '../types';
import { RESTAURANTS } from './restaurants';

// High resolution food photo collection
const FOOD_PHOTOS: Record<string, string[]> = {
  Burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&auto=format&fit=crop&q=80'
  ],
  Pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80'
  ],
  Biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
  ],
  Chinese: [
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80'
  ],
  'Sushi & Japanese': [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&auto=format&fit=crop&q=80'
  ],
  'Italian & Pasta': [
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&auto=format&fit=crop&q=80'
  ],
  Mexican: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop&q=80'
  ],
  'Healthy & Bowls': [
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&auto=format&fit=crop&q=80'
  ],
  'Desserts & Bakery': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'
  ],
  'Coffee & Cafe': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80'
  ],
  Beverages: [
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80'
  ],
  'Indian & Curries': [
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
  ],
  'American BBQ': [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80'
  ],
  'Asian & Noodles': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80'
  ]
};

// Customizer templates in INR (₹)
const BURGER_CUSTOMIZATIONS: CustomizationGroup[] = [
  {
    id: 'patty',
    name: 'Choose Your Patty',
    type: 'single',
    required: true,
    choices: [
      { id: 'crispy_veg', name: 'Crispy Herbed Veg Patty', price: 0, isDefault: true },
      { id: 'grilled_paneer', name: 'Smoked Spiced Paneer Steak', price: 50 },
      { id: 'buttermilk_chicken', name: 'Crunchy Buttermilk Chicken', price: 80 },
      { id: 'double_patty', name: 'Double Patty (+100g)', price: 120 }
    ]
  },
  {
    id: 'cheese',
    name: 'Cheese Selection',
    type: 'single',
    required: false,
    choices: [
      { id: 'cheddar', name: 'Aged English Cheddar', price: 0, isDefault: true },
      { id: 'liquid_cheese', name: 'Liquid Lava Cheese Drizzle', price: 40 },
      { id: 'smoked_gouda', name: 'Smoked Dutch Gouda', price: 60 }
    ]
  },
  {
    id: 'toppings',
    name: 'Extra Gourmet Add-ons',
    type: 'multiple',
    required: false,
    maxSelections: 3,
    choices: [
      { id: 'caramelized_onions', name: 'Caramelized Balsamic Onions', price: 30 },
      { id: 'jalapenos', name: 'Fire Pickled Jalapenos', price: 25 },
      { id: 'truffle_mayo', name: 'Black Truffle Garlic Aioli', price: 45 }
    ]
  }
];

const PIZZA_CUSTOMIZATIONS: CustomizationGroup[] = [
  {
    id: 'size',
    name: 'Select Size',
    type: 'single',
    required: true,
    choices: [
      { id: 'reg_10', name: '10" Regular (Serves 1-2)', price: 0, isDefault: true },
      { id: 'large_14', name: '14" Medium (Serves 2-3)', price: 180 },
      { id: 'party_18', name: '18" Party Size (Serves 4-5)', price: 350 }
    ]
  },
  {
    id: 'crust',
    name: 'Crust Preference',
    type: 'single',
    required: true,
    choices: [
      { id: 'sourdough', name: 'Traditional Neapolitan Sourdough', price: 0, isDefault: true },
      { id: 'thin_crisp', name: 'Ultra-thin Roman Crisp', price: 0 },
      { id: 'cheese_burst', name: 'Mozzarella Cheese Burst', price: 99 }
    ]
  },
  {
    id: 'extra_toppings',
    name: 'Extra Toppings',
    type: 'multiple',
    required: false,
    choices: [
      { id: 'extra_mozzarella', name: 'Extra Buffalo Mozzarella', price: 70 },
      { id: 'olives_mushrooms', name: 'Kalamata Olives & Mushrooms', price: 50 },
      { id: 'peri_peri', name: 'Peri-Peri Paneer / Chicken', price: 65 }
    ]
  }
];

const BIRYANI_CUSTOMIZATIONS: CustomizationGroup[] = [
  {
    id: 'portion',
    name: 'Portion Size',
    type: 'single',
    required: true,
    choices: [
      { id: 'regular', name: 'Regular Handi (Serves 1)', price: 0, isDefault: true },
      { id: 'family', name: 'Family Handi (Serves 2-3)', price: 250 }
    ]
  },
  {
    id: 'spice',
    name: 'Spice Level',
    type: 'single',
    required: false,
    choices: [
      { id: 'mild', name: 'Mild & Fragrant', price: 0 },
      { id: 'medium', name: 'Classic Awadhi Medium', price: 0, isDefault: true },
      { id: 'fiery', name: 'Hyderabadi Fiery Spicy', price: 0 }
    ]
  },
  {
    id: 'addons',
    name: 'Accompaniments',
    type: 'multiple',
    required: false,
    choices: [
      { id: 'extra_egg', name: 'Golden Spiced Boiled Egg (2 pcs)', price: 40 },
      { id: 'burani_raita', name: 'Garlic Burani Raita', price: 45 },
      { id: 'mirchi_salan', name: 'Hyderabadi Mirchi Ka Salan', price: 50 },
      { id: 'gulab_jamun', name: 'Hot Angoori Gulab Jamun (2 pcs)', price: 60 }
    ]
  }
];

// Reusable dish catalog templates in INR (₹)
const DISH_BLUEPRINTS: Record<string, Array<{
  name: string;
  desc: string;
  price: number;
  isVeg: boolean;
  isBestseller: boolean;
  isSpicy?: boolean;
  calories: number;
  prepTime: number;
}>> = {
  Burgers: [
    { name: 'Truffle Smash Double Cheeseburger', desc: 'Double smash patty, melted aged cheddar, caramelized balsamic onions, black truffle aioli on toasted brioche.', price: 299, isVeg: false, isBestseller: true, calories: 780, prepTime: 15 },
    { name: 'Nashville Hot Crispy Chicken Burger', desc: 'Cayenne spiced buttermilk fried chicken thigh, creamy slaw, dill pickles, comeback sauce.', price: 269, isVeg: false, isBestseller: true, isSpicy: true, calories: 720, prepTime: 14 },
    { name: 'Spiced Paneer Tikka Smash Burger', desc: 'Charcoal grilled cottage cheese steak, mint coriander labneh, red onion relish, brioche.', price: 229, isVeg: true, isBestseller: true, isSpicy: true, calories: 590, prepTime: 12 },
    { name: 'Smoked BBQ Double Stack Burger', desc: 'Crispy onion rings, house bourbon BBQ glaze, Monterey Jack cheese, seeded bun.', price: 319, isVeg: false, isBestseller: false, calories: 860, prepTime: 16 },
    { name: 'Avocado Beyond Plant Burger', desc: 'Plant-based patty, smashed Hass avocado, arugula, chipotle veganaise on wholewheat bun.', price: 279, isVeg: true, isBestseller: false, calories: 510, prepTime: 12 },
    { name: 'Peri-Peri Parmesan Truffle Fries', desc: 'Double-cooked crispy fries tossed in peri-peri spices, white truffle oil, grated Parmigiano.', price: 149, isVeg: true, isBestseller: true, calories: 420, prepTime: 8 }
  ],
  Pizza: [
    { name: 'Smoked Burrata & Spicy Pepperoni Pizza', desc: 'San Marzano DOP tomato sauce, fresh buffalo mozzarella, pepperoni cups, creamy burrata center, chili honey.', price: 449, isVeg: false, isBestseller: true, isSpicy: true, calories: 920, prepTime: 20 },
    { name: 'Classic Margherita con Bufala', desc: 'Slow fermented sourdough, sweet San Marzano tomatoes, fior di latte mozzarella, fresh genovese basil, EVOO.', price: 329, isVeg: true, isBestseller: true, calories: 710, prepTime: 16 },
    { name: 'Quattro Formaggi & Truffle Honey', desc: 'Gorgonzola dolce, fontina, smoked scamorza, parmigiano, topped with wild thyme and white truffle honey.', price: 419, isVeg: true, isBestseller: false, calories: 880, prepTime: 18 },
    { name: 'Paneer Tikka Woodfired Sourdough Pizza', desc: 'Charcoal charred paneer tikka cubes, crunchy capsicum, red onions, mozzarella on spicy makhani sauce.', price: 369, isVeg: true, isBestseller: true, calories: 790, prepTime: 18 },
    { name: 'Cheesy Garlic Breadsticks with Marinara', desc: 'Wood-fired sourdough breadsticks brushed with roasted garlic herb butter, mozzarella, marinara dip.', price: 159, isVeg: true, isBestseller: true, calories: 380, prepTime: 10 }
  ],
  Biryani: [
    { name: 'Royal Awadhi Dum Mutton Biryani', desc: 'Slow-cooked in clay handi over coal. Extra long aged basmati rice infused with saffron, melt-in-mouth lamb, spices.', price: 429, isVeg: false, isBestseller: true, isSpicy: true, calories: 850, prepTime: 22 },
    { name: 'Hyderabadi Kacchi Dum Chicken Biryani', desc: 'Marinated chicken layered with fragrant basmati, fried brown onions, mint, kewra water, served with salan.', price: 349, isVeg: false, isBestseller: true, isSpicy: true, calories: 790, prepTime: 20 },
    { name: 'Kolkata Special Egg & Potato Biryani', desc: 'Spiced golden hard-boiled eggs, tender melt-in-mouth saffron potatoes, fragrant basmati.', price: 249, isVeg: false, isBestseller: false, calories: 640, prepTime: 18 },
    { name: 'Subz Shahi Paneer Dum Biryani', desc: 'Charcoal grilled cottage cheese cubes, baby carrots, French beans, saffron rice, roasted cashews.', price: 289, isVeg: true, isBestseller: true, calories: 680, prepTime: 18 },
    { name: 'Tandoori Chicken Tikka (6 Pcs)', desc: 'Boneless tender chicken chunks marinated in mustard oil, yogurt, Kashmiri degi mirch, mint chutney.', price: 269, isVeg: false, isBestseller: true, isSpicy: true, calories: 420, prepTime: 15 }
  ],
  'Sushi & Japanese': [
    { name: 'Premium Otoro & Salmon Aburi Box', desc: 'Bluefin fatty tuna and Norwegian salmon nigiri lightly torched with sweet nikiri soy, oscietra caviar.', price: 599, isVeg: false, isBestseller: true, calories: 480, prepTime: 18 },
    { name: 'Spicy Crunchy Tuna Uramaki Roll (8 Pcs)', desc: 'Sashimi grade yellowfin tuna, spicy sriracha togarashi mayo, crispy tempura flakes, cucumber.', price: 399, isVeg: false, isBestseller: true, isSpicy: true, calories: 420, prepTime: 14 },
    { name: 'Crispy Tiger Prawn Tempura Roll (8 Pcs)', desc: 'Jumbo tiger prawn tempura, avocado, tobiko orange flying fish roe, sweet unagi kabayaki sauce.', price: 449, isVeg: false, isBestseller: false, calories: 510, prepTime: 15 },
    { name: 'Truffle Avocado & Cream Cheese Roll', desc: 'Fresh ripe avocado, Philadelphia cream cheese, cucumber, white truffle oil glaze.', price: 329, isVeg: true, isBestseller: true, calories: 340, prepTime: 12 },
    { name: 'Steamed Edamame with Truffle Sea Salt', desc: 'Young green soybean pods dusted with flaky Maldon sea salt and aromatic black truffle essence.', price: 189, isVeg: true, isBestseller: true, calories: 180, prepTime: 8 }
  ],
  'Asian & Noodles': [
    { name: 'Spicy Miso Black Garlic Tonkotsu Ramen', desc: '16-hour simmered pork broth, hand-crafted ramen noodles, chashu pork belly, ajitsuke egg, black garlic oil.', price: 419, isVeg: false, isBestseller: true, isSpicy: true, calories: 720, prepTime: 18 },
    { name: 'Tokyo Shoyu Truffle Chicken Ramen', desc: 'Golden chicken dashi broth, slow-cooked sous-vide chicken breast, bamboo shoots, truffle paste.', price: 389, isVeg: false, isBestseller: false, calories: 640, prepTime: 16 },
    { name: 'Crispy Honey Butter Korean Chicken Bowl', desc: 'Double fried crunchy chicken chunks glazed in sweet honey garlic butter over warm purple sticky rice.', price: 329, isVeg: false, isBestseller: true, calories: 780, prepTime: 15 },
    { name: 'Wild Forest Mushroom Veg Miso Ramen', desc: 'Rich vegetable and kombu broth, sauteed king oyster mushrooms, pak choi, sesame chili oil.', price: 349, isVeg: true, isBestseller: false, calories: 510, prepTime: 15 }
  ],
  Chinese: [
    { name: 'Szechuan Chilli Garlic Hakka Noodles', desc: 'Smoky wok-tossed noodles with shredded cabbage, bell peppers, scallions, fiery roasted chili oil.', price: 219, isVeg: true, isBestseller: true, isSpicy: true, calories: 560, prepTime: 14 },
    { name: 'Crispy Kung Pao Chicken with Cashews', desc: 'Tender chicken tossed in sweet, tangy and tongue-tingling Szechuan peppercorn sauce with toasted cashews.', price: 299, isVeg: false, isBestseller: true, isSpicy: true, calories: 640, prepTime: 15 },
    { name: 'Steamed Crystal Dim Sum Basket (6 Pcs)', desc: 'Handcrafted dim sum filled with wild forest mushrooms, water chestnuts, and edamame.', price: 249, isVeg: true, isBestseller: false, calories: 280, prepTime: 12 },
    { name: 'Sweet & Spicy Crispy Honey Lotus Stem', desc: 'Crisp fried thinly sliced lotus stems tossed in honey chili garlic glaze with toasted sesame seeds.', price: 229, isVeg: true, isBestseller: true, isSpicy: true, calories: 360, prepTime: 10 }
  ],
  'Italian & Pasta': [
    { name: 'Truffle Wild Mushroom Fettuccine', desc: 'Handmade fresh egg fettuccine, porcini mushroom reduction, Parmigiano-Reggiano cream, shaved black truffle.', price: 399, isVeg: true, isBestseller: true, calories: 690, prepTime: 16 },
    { name: 'Classic Roman Carbonara Spaghetti', desc: 'Spaghetti tossed with cured crispy bacon, egg yolks, Pecorino Romano, cracked black pepper.', price: 389, isVeg: false, isBestseller: true, calories: 780, prepTime: 15 },
    { name: 'Slow-Braised Bolognese Tagliatelle', desc: 'Slow-simmered 6-hour meat ragu with San Marzano tomatoes, red wine, fresh herbs over tagliatelle ribbons.', price: 429, isVeg: false, isBestseller: false, calories: 740, prepTime: 18 },
    { name: 'Creamy Burrata & Sundried Tomato Penne', desc: 'Artisanal penne coated in basil pesto, topped with whole cream-filled pugliese burrata cheese ball.', price: 379, isVeg: true, isBestseller: false, calories: 710, prepTime: 15 }
  ],
  Mexican: [
    { name: 'Birria Quesatacos with Rich Consomé (3 Pcs)', desc: 'Crispy griddled corn tortillas stuffed with juicy braised meat and melted Oaxaca cheese, side of rich broth.', price: 349, isVeg: false, isBestseller: true, isSpicy: true, calories: 720, prepTime: 16 },
    { name: 'Baja Crispy Beer-Battered Fish Tacos', desc: 'Crunchy golden cod fillets, tangy chipotle crema, shredded red cabbage slaw, avocado salsa on flour tortillas.', price: 319, isVeg: false, isBestseller: true, calories: 580, prepTime: 14 },
    { name: 'Smoky Chipotle Chicken Burrito Bowl', desc: 'Cilantro lime brown rice, black beans, grilled chipotle chicken, charred corn salsa, guacamole, sour cream.', price: 289, isVeg: false, isBestseller: false, calories: 660, prepTime: 12 },
    { name: 'Loaded Guacamole & Hand-Pressed Chips', desc: 'Freshly smashed Hass avocado with lime, jalapeño, cilantro, topped with queso fresco.', price: 189, isVeg: true, isBestseller: true, calories: 410, prepTime: 8 }
  ],
  'Healthy & Bowls': [
    { name: 'Avocado Quinoa Green Goddess Bowl', desc: 'Organic tricolor quinoa, roasted butternut squash, edamame, baby spinach, heirloom tomatoes, green goddess tahini.', price: 289, isVeg: true, isBestseller: true, calories: 460, prepTime: 12 },
    { name: 'Teriyaki Wild Salmon Poke Bowl', desc: 'Glazed Norwegian wild salmon, sushi rice, mango cubes, cucumber ribbons, pickled ginger, spicy ponzu drizzle.', price: 449, isVeg: false, isBestseller: true, calories: 540, prepTime: 14 },
    { name: 'Grilled Herb Chicken Superfood Salad', desc: 'Free-range grilled chicken breast, mixed baby greens, blueberries, candied walnuts, goat cheese, balsamic vinaigrette.', price: 319, isVeg: false, isBestseller: false, calories: 430, prepTime: 12 },
    { name: 'Açai Superberry Smoothie Bowl', desc: 'Pure organic Brazilian açai blended with banana, topped with chia seeds, granola, fresh strawberries, peanut butter drizzle.', price: 249, isVeg: true, isBestseller: false, calories: 380, prepTime: 8 }
  ],
  'Desserts & Bakery': [
    { name: 'Molten Belgian Dark Chocolate Dome', desc: 'Warm 72% Callebaut dark chocolate cake with overflowing liquid center, paired with Madagascar vanilla bean gelato.', price: 229, isVeg: true, isBestseller: true, calories: 540, prepTime: 12 },
    { name: 'Nutella & Fresh Strawberry Belgian Waffle', desc: 'Crispy-chewy pearl sugar Liege waffle smothered in creamy Nutella, fresh strawberries, whipped cream.', price: 199, isVeg: true, isBestseller: true, calories: 620, prepTime: 10 },
    { name: 'New York Baked Lotus Biscoff Cheesecake', desc: 'Velvety cream cheese filling over caramelized Biscoff crust, topped with warm cookie butter spread.', price: 189, isVeg: true, isBestseller: false, calories: 490, prepTime: 8 },
    { name: 'Classic Venetian Tiramisu Glass', desc: 'Espresso-soaked savoiardi ladyfingers layered with whipped mascarpone cream and dusted with Dutch cocoa.', price: 179, isVeg: true, isBestseller: true, calories: 410, prepTime: 6 }
  ],
  'Coffee & Cafe': [
    { name: 'Iced Spanish Vanilla Latte', desc: 'Double ristretto espresso shots poured over sweet condensed milk, whole milk, and organic vanilla bean syrup.', price: 169, isVeg: true, isBestseller: true, calories: 210, prepTime: 5 },
    { name: 'Artisan Flaky Butter Croissant', desc: 'Baked fresh every morning with 82% Normandy cultured butter. 32 crisp airy honeycomb layers.', price: 129, isVeg: true, isBestseller: true, calories: 290, prepTime: 4 },
    { name: 'Cold Brew Oat Milk Cloud Shakerato', desc: 'Single-origin Arabica beans steeped for 24 hours, shaken with creamy oat milk and caramel notes.', price: 179, isVeg: true, isBestseller: false, calories: 120, prepTime: 5 },
    { name: 'Ceremonial Japanese Matcha Green Tea Latte', desc: 'Stone-ground Uji matcha whisked with warm textured almond milk and a drop of organic blue agave.', price: 189, isVeg: true, isBestseller: false, calories: 160, prepTime: 6 }
  ],
  Beverages: [
    { name: 'Royal Brown Sugar Boba Pearl Milk', desc: 'Warm chewy brown sugar tapioca pearls, fresh whole organic milk, rich caramelized cream froth top.', price: 189, isVeg: true, isBestseller: true, calories: 340, prepTime: 6 },
    { name: 'Passion Fruit Mango Jasmine Sparkling Fizz', desc: 'Brewed fragrant jasmine green tea with real passion fruit pulp, Alphonso mango, sparkling water.', price: 149, isVeg: true, isBestseller: false, calories: 140, prepTime: 5 },
    { name: 'Belgian Chocolate Thickshake with Oreo', desc: 'Double scoop dark chocolate ice cream churned with whole milk, crunchy Oreo biscuit bits, chocolate fudge.', price: 169, isVeg: true, isBestseller: true, calories: 490, prepTime: 6 }
  ],
  'Indian & Curries': [
    { name: 'Velvet Butter Chicken (Murgh Makhani)', desc: 'Clay tandoor roasted boneless chicken simmered in rich creamy tomato, cashew butter gravy with kasuri methi.', price: 349, isVeg: false, isBestseller: true, calories: 690, prepTime: 18 },
    { name: 'Smoked Paneer Lababdar', desc: 'Cottage cheese chunks cooked in spiced onion-tomato and melon seed gravy, finished with fresh cream.', price: 299, isVeg: true, isBestseller: true, calories: 580, prepTime: 16 },
    { name: 'Dal Makhani 24-Hour Coal Simmered', desc: 'Black lentils slow cooked overnight on glowing charcoal, enriched with churned butter, cream, and Punjabi spices.', price: 249, isVeg: true, isBestseller: true, calories: 480, prepTime: 14 },
    { name: 'Tandoori Garlic Butter Naan (2 Pcs)', desc: 'Clay oven charred fluffy flatbread brushed with crushed garlic and melted churned butter.', price: 89, isVeg: true, isBestseller: true, calories: 260, prepTime: 6 }
  ],
  'American BBQ': [
    { name: '14-Hour Post Oak Smoked Beef Brisket', desc: 'Crusted in coarse black pepper and sea salt, smoked low and slow for 14 hours. Served with Texas toast.', price: 549, isVeg: false, isBestseller: true, calories: 840, prepTime: 20 },
    { name: 'St. Louis Sticky Honey Glazed Pork Ribs', desc: 'Half rack of tender fall-off-the-bone ribs glazed in sweet apple cider BBQ reduction.', price: 499, isVeg: false, isBestseller: true, calories: 890, prepTime: 20 },
    { name: 'Cast Iron Four-Cheese Mac & Bacon', desc: 'Elbow macaroni tossed in bubbling aged gouda, sharp cheddar, gruyere, topped with bacon crust.', price: 249, isVeg: false, isBestseller: false, calories: 590, prepTime: 12 }
  ]
};

function generateFoodItems(): FoodItem[] {
  const items: FoodItem[] = [];
  let itemCounter = 1;

  RESTAURANTS.forEach((restaurant, rIndex) => {
    const rCuisines = restaurant.cuisines;

    rCuisines.forEach((cuisine) => {
      const blueprints = DISH_BLUEPRINTS[cuisine] || DISH_BLUEPRINTS['Burgers'];
      const photos = FOOD_PHOTOS[cuisine] || FOOD_PHOTOS['Burgers'];

      blueprints.forEach((bp, bpIdx) => {
        const photo = photos[(bpIdx + rIndex) % photos.length];

        let customizations: CustomizationGroup[] | undefined;
        if (cuisine === 'Burgers') customizations = BURGER_CUSTOMIZATIONS;
        else if (cuisine === 'Pizza') customizations = PIZZA_CUSTOMIZATIONS;
        else if (cuisine === 'Biryani') customizations = BIRYANI_CUSTOMIZATIONS;

        const originalPrice = bp.price > 200 ? Math.round(bp.price * 1.25) : undefined;

        const foodItem: FoodItem = {
          id: `food-${itemCounter}`,
          restaurantId: restaurant.id,
          name: bp.name,
          description: bp.desc,
          price: bp.price,
          originalPrice,
          image: photo,
          category: cuisine,
          rating: Number((4.3 + ((itemCounter * 3) % 7) * 0.1).toFixed(1)),
          ratingCount: 50 + ((itemCounter * 23) % 600),
          isVeg: bp.isVeg,
          isBestseller: bp.isBestseller,
          isSpicy: bp.isSpicy,
          calories: bp.calories,
          preparationTimeMinutes: bp.prepTime,
          customizations,
          available: true,
          allergens: bp.isVeg ? ['Dairy'] : ['Gluten', 'Dairy']
        };

        items.push(foodItem);
        if (!restaurant.menuItemIds) {
          restaurant.menuItemIds = [];
        }
        restaurant.menuItemIds.push(foodItem.id);
        itemCounter++;
      });
    });
  });

  return items;
}

export const FOOD_ITEMS: FoodItem[] = generateFoodItems();
