// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025"}); // Corrected model name

app.use(cors());
app.use(express.json());



// --- Authentication Middleware ---
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: 'Authentication required: No token provided.' });
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ error: 'Authentication failed: Invalid token.' });
    }
    req.user = user; // Attach user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Auth middleware unexpected error:", err);
    return res.status(401).json({ error: 'Authentication failed.' });
  }
};



// --- PROTECTED CART ROUTES ---

// GET /api/cart - Fetch user's cart items
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_cart_items')
      .select('*, menu_items(*)') // Fetch cart item and the related menu item details
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true }); // Optional: order items

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: 'Failed to fetch cart items.' });
  }
});

// POST /api/cart - Add an item or update quantity
app.post('/api/cart', authMiddleware, async (req, res) => {
  const { menu_item_id, quantity } = req.body;
  if (!menu_item_id || quantity == null || quantity <= 0) {
    return res.status(400).json({ error: 'Menu item ID and valid quantity are required.' });
  }

  try {
    // Check if item already exists in cart for this user
    const { data: existingItem, error: findError } = await supabase
      .from('user_cart_items')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('menu_item_id', menu_item_id)
      .maybeSingle(); // Returns null if not found, instead of error

    if (findError) throw findError;

    let result;
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from('user_cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select('*, menu_items(*)'); // Return updated item with menu details
      if (error) throw error;
      result = data[0];
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('user_cart_items')
        .insert({ user_id: req.user.id, menu_item_id, quantity })
        .select('*, menu_items(*)'); // Return new item with menu details
      if (error) throw error;
      result = data[0];
    }
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart (using cart_item_id)
app.delete('/api/cart/:itemId', authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', req.user.id) // Ensure user owns this item
      .eq('id', itemId);

    if (error) throw error;
    res.status(204).send(); // No content on successful delete
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

// PUT /api/cart/:itemId - Update specific item quantity
app.put('/api/cart/:itemId', authMiddleware, async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 0) {
        return res.status(400).json({ error: 'Invalid quantity provided.' });
    }

    try {
        if (quantity === 0) {
            // If quantity is 0, delete the item
            const { error } = await supabase
              .from('user_cart_items')
              .delete()
              .eq('user_id', req.user.id)
              .eq('id', itemId);
            if (error) throw error;
            return res.status(204).send();
        } else {
            // Otherwise, update the quantity
            const { data, error } = await supabase
              .from('user_cart_items')
              .update({ quantity })
              .eq('user_id', req.user.id)
              .eq('id', itemId)
              .select('*, menu_items(*)');
            if (error) throw error;
            if (!data || data.length === 0) return res.status(404).json({ error: 'Cart item not found.' });
            return res.json(data[0]);
        }
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ error: 'Failed to update item quantity.' });
    }
});


// --- PROTECTED FAVORITES ROUTES ---

// GET /api/favorites - Fetch user's favorite items
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*, menu_items(*)') // Fetch favorite record and related menu item
      .eq('user_id', req.user.id);
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});

// POST /api/favorites - Add an item to favorites
app.post('/api/favorites', authMiddleware, async (req, res) => {
  const { menu_item_id } = req.body;
  if (!menu_item_id) {
    return res.status(400).json({ error: 'Menu item ID is required.' });
  }
  try {
    // Optionally: Check if already favorited before inserting
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({ user_id: req.user.id, menu_item_id })
      .select('*, menu_items(*)'); // Return the new favorite with menu details

    if (error) {
      // Handle potential duplicate error gracefully if needed
      if (error.code === '23505') { // Unique constraint violation
         return res.status(409).json({ message: 'Item already in favorites.' });
      }
      throw error;
    }
    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: 'Failed to add favorite.' });
  }
});

// DELETE /api/favorites/:menuItemId - Remove an item from favorites
app.delete('/api/favorites/:menuItemId', authMiddleware, async (req, res) => {
  const { menuItemId } = req.params;
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('menu_item_id', menuItemId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: 'Failed to remove favorite.' });
  }
});

app.get('/api/menu', async (req, res) => {
  const { category } = req.query;
  try {
    let query = supabase.from('menu_items').select('*');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('category');
    if (error) throw error;

    const categories = data.map(item => item.category);
    const uniqueCategories = [...new Set(categories)]; // This line finds all unique categories

    res.json(uniqueCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * @route   POST /api/contact
 * @desc    Save a new contact form submission to the database.
 * @access  Public
 */
app.post('/api/contact', async (req, res) => {
  // 1. Get the data from the form submission
  const { name, email, subject, message } = req.body;

  // 2. Basic validation to ensure no fields are empty
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // 3. Insert the data into your new Supabase table
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        { name, email, subject, message },
      ]);

    if (error) throw error;

    // 4. Send a success response back to the frontend
    res.status(201).json({ message: 'Message sent successfully!' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

/**
 * @route   POST /api/reservations
 * @desc    Save a new reservation and send a confirmation email.
 * @access  Public
 */
app.post('/api/reservations', async (req, res) => {
  const { name, email, guests, date, time, requests } = req.body;

  if (!name || !email || !guests || !date || !time) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  try {
    // 1. Save the reservation to the database
    const { data: reservationData, error: dbError } = await supabase
      .from('reservations')
      .insert([{ name, email, guests, date, time, requests }])
      .select();

    if (dbError) throw dbError;

    // 2. Send the confirmation email to the user
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Smart Restaurant <onboarding@resend.dev>', // Use Resend's test domain for now
      to: [email],
      subject: 'Your Reservation is Confirmed!',
      html: `
        <h1>Reservation Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your reservation. Here are the details:</p>
        <ul>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
        <p>We look forward to seeing you!</p>
        <p>- The Smart Restaurant Hub Team</p>
      `,
    });

    if (emailError) throw emailError;

    res.status(201).json({ message: 'Reservation confirmed! Please check your email.' });

  } catch (error) {
    console.error("Reservation Error:", error);
    res.status(500).json({ error: 'Failed to create reservation.' });
  }
});


/**
 * @route   POST /api/create-payment-intent
 * @desc    Creates a Stripe Payment Intent for the current cart total.
 * @access  Public (should ideally be protected later)
 */
app.post('/api/create-payment-intent', async (req, res) => {
  const { items } = req.body; // Expect items from the frontend cart

  // --- IMPORTANT: Calculate amount securely on the backend ---
  // In a real app, fetch item prices from your DB based on IDs sent from the client
  // For now, we'll simulate a calculation (replace with your actual logic)
  const calculateOrderAmount = (cartItems) => {
    // Replace this with your actual logic fetching prices from DB
    let total = 0;
    cartItems.forEach(item => {
      // Example: Find item price based on item.id (replace with DB lookup)
      const prices = { '1': 1000, '2': 2000 }; // Item ID: Price in cents
      total += (prices[item.id] || 0) * item.quantity;
    });
    return total; // Return amount in cents
  };

  const amountInCents = calculateOrderAmount(items);

  if (amountInCents <= 0) {
      return res.status(400).send({ error: 'Invalid order amount.' });
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Change to your currency if needed
      automatic_payment_methods: {
        enabled: true, // Let Stripe handle payment method types
      },
    });

    // Send the clientSecret back to the frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).send({ error: error.message });
  }
});




// --- NEW: Helper function for retries with exponential backoff ---
async function generateContentWithRetry(prompt, retries = 3, delay = 1000) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    if (!response || !response.text) {
        console.error("Gemini API Error: No response text found.", response);
        throw new Error("AI response format was invalid.");
    }
    return response.text();
  } catch (error) {
    // Check if it's a retryable error (like 503) and if we have retries left
    if (retries > 0 && error.status === 503) {
      console.log(`Gemini API overloaded. Retrying in ${delay / 1000}s... (${retries} retries left)`);
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      // Retry with one less retry attempt and double the delay
      return generateContentWithRetry(prompt, retries - 1, delay * 2);
    } else {
      // If it's not a retryable error or no retries left, throw the error
      console.error('Gemini API Error (Final):', error); 
      throw error; // Re-throw the error to be caught by the main handler
    }
  }
}



const restaurantInfo = {
  name: "Smart Restaurant Hub",
  hours: {
    "Monday - Tuesday": "09:00 AM - 10:00 PM",
    "Wednesday": "08:30 AM - 08:30 PM",
    "Thursday - Friday": "09:45 AM - 07:55 PM",
    "Saturday": "10:00 AM - 08:45 PM",
    "Sunday": "08:00 AM - 07:10 PM",
    "Holidays": "Closed"
  },
  phone: "207-8767-452",
  address: "2443 Oak Ridge, Leander, TX",
  website: "http://localhost:5173" // Assuming this is your frontend URL
};


app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  console.log(`Received message: ${userMessage}`);
  const lowerCaseMessage = userMessage.toLowerCase();

  try {
    let finalPrompt;
    let responseType = 'ai_generated'; // Default type

    // --- Intent Detection ---

    // 1. Check for Timings/Hours
    if (/\b(hours|open|close|timing|when)\b/i.test(lowerCaseMessage)) {
      console.log("Intent: Get Hours");
      const hoursString = Object.entries(restaurantInfo.hours)
        .map(([day, time]) => `${day}: ${time}`)
        .join('\n');
      finalPrompt = `You are a helpful assistant for ${restaurantInfo.name}. The customer asked about opening hours. Here are the hours:\n${hoursString}\nPolitely and concisely answer the customer's question "${userMessage}" using this information.`;

    // 2. Check for Reservation Intent
    } else if (/\b(reservation|book|table|reserve)\b/i.test(lowerCaseMessage)) {
      console.log("Intent: Make Reservation");
      // Don't call AI, just guide the user
      responseType = 'direct_response';
      res.json({ reply: `Great! You can easily reserve a table by visiting our Reservation page: ${restaurantInfo.website}/reservation` });
      return; // Stop processing

    // 3. Check for Contact Info Intent
    } else if (/\b(contact|phone|address|number|location)\b/i.test(lowerCaseMessage)) {
      console.log("Intent: Get Contact Info");
      finalPrompt = `You are a helpful assistant for ${restaurantInfo.name}. The customer asked for contact information. Here are the details:\nPhone: ${restaurantInfo.phone}\nAddress: ${restaurantInfo.address}\nPolitely and concisely answer the customer's question "${userMessage}" using this information.`;

    // 4. Check for Menu-related Intent (Improved Keywords & Synonyms)
    } else if (/\b(menu|dish|food|eat|spicy|vegetarian|chicken|dessert|drink|biryani|pizza|sweet|salad|soup|appetizer|main course|beverage|curry)\b/i.test(lowerCaseMessage)) {
      console.log("Intent: Menu Query");
      let relevantMenuItems = [];
      const searchTerms = lowerCaseMessage.match(/\b(\w{3,})\b/g) || []; // Extract words 3+ chars

      let query = supabase.from('menu_items').select('name, description, price, category');

      if (searchTerms.length > 0) {
        // Handle synonyms manually for now (can be expanded)
        const synonyms = { sweet: 'dessert', sweets: 'dessert' };
        const expandedTerms = searchTerms.flatMap(term => synonyms[term] ? [term, synonyms[term]] : [term]);
        const uniqueTerms = [...new Set(expandedTerms)]; // Remove duplicates

        const orConditions = uniqueTerms.map(term => `name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`).join(',');
        query = query.or(orConditions);
      } else {
        query = query.limit(5); // Fallback for generic "menu"
      }

      const { data, error: dbError } = await query.limit(10);

      if (dbError) { console.error("Supabase query error:", dbError); }
      else { relevantMenuItems = data || []; console.log(`Found ${relevantMenuItems.length} menu items:`, relevantMenuItems.map(i=>i.name)); }

      if (relevantMenuItems.length > 0) {
        const menuContext = relevantMenuItems.map(item =>
          `- ${item.name} (${item.category}): ${item.description || 'N/A'} ($${item.price || 'N/A'})`
        ).join('\n');
        // --- PROMPT ASKING FOR CONCISE RESPONSE ---
        finalPrompt = `You are a friendly assistant for Smart Restaurant Hub answering: "${userMessage}". Based primarily on these items, give a SHORT and POLITE answer (1-2 sentences). List relevant dishes found and prices if they directly answer. If not a direct match, politely suggest browsing the full menu.\nMenu Items:\n${menuContext}`;
      } else {
        finalPrompt = `You are a friendly assistant for Smart Restaurant Hub answering: "${userMessage}". I couldn't find specific items matching that. Please politely suggest browsing the full menu or asking differently. Keep the response SHORT.`;
      }

    // 5. Default/General Conversation
    } else {
      console.log("Intent: General");
      finalPrompt = `You are a helpful and friendly chat assistant. Keep your response SHORT and conversational for: "${userMessage}"`;
    }

    // --- Call Gemini API (only if responseType is 'ai_generated') ---
    if (responseType === 'ai_generated') {
      console.log("Sending prompt to Gemini:", finalPrompt);
      const aiMessage = await generateContentWithRetry(finalPrompt);
      console.log("Received reply from Gemini:", aiMessage);
      res.json({ reply: aiMessage });
    }

  } catch (error) {
    res.status(500).json({ error: 'Sorry, I encountered an internal error. Please try again later.' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});