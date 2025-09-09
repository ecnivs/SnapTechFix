const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ============================
// 📚 Knowledge Base
// ============================
const intents = [
  {
    intent: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good evening"],
    responses: [
      "Hello! How can I assist you with your device today?",
      "Hi there 👋 Need help with repairs, buyback, or warranty?",
      "Hey! I'm here to help with repairs and buyback."
    ]
  },
  {
    intent: "repair_services",
    patterns: [
      "repair services", "services offered", "fix devices", "what can you repair",
      "repair iphone", "repair android", "repair laptop", "repair tablet",
      "screen replacement", "battery replacement", "charging port", "camera repair"
    ],
    responses: [
      "We repair smartphones, laptops, and tablets. Services include:\n- Screen replacement\n- Battery replacement\n- Camera repair\n- Charging port fix\n- Software troubleshooting\n- Water damage treatment\n- Buyback & trade-in support"
    ]
  },
  {
    intent: "repair_cost",
    patterns: [
      "how much", "repair cost", "price to fix", "estimate", "screen crack",
      "broken display", "iphone screen repair", "battery change", "replace battery"
    ],
    responses: [
      "Repair costs depend on the device and issue. For example:\n- iPhone screen replacement: starts from ₹4,999.\n- Battery replacement: from ₹2,499.\n- Water damage repair: from ₹3,999.\nWould you like an estimate for your exact model?"
    ]
  },
  {
    intent: "water_damage",
    patterns: [
      "water damage", "phone fell in water", "my phone got wet", "liquid damage", "dropped in water"
    ],
    responses: [
      "Don’t worry! 💧 We handle water-damaged devices. Please switch it off immediately and avoid charging it. Our water damage repair starts at ₹3,999, and we also check for long-term effects on the motherboard."
    ]
  },
  {
    intent: "buyback",
    patterns: ["buyback", "sell my phone", "trade-in", "exchange phone", "old device"],
    responses: [
      "Our buyback process is quick:\n1. Share your device model & condition.\n2. We give you an instant price quote.\n3. You hand over the device.\n4. Get instant cash or credits for a new device!"
    ]
  },
  {
    intent: "warranty",
    patterns: ["warranty", "repair warranty", "guarantee"],
    responses: [
      "Yes ✅ All our repairs come with a warranty:\n- Screen & major parts: up to 6 months\n- Battery replacement: 3 months\n- General service: 30 days"
    ]
  },
  {
    intent: "fallback",
    patterns: [],
    responses: [
      "I'm not sure about that 🤔, but I can help you with repairs, buyback, warranty, and device concerns.",
      "Sorry, I don’t have details on that. But I can answer anything about smartphones, laptops, or tablets repairs & buyback."
    ]
  }
];


// ============================
// 🧠 Intent Matching Function
// ============================
function getIntent(message) {
  const msg = message.toLowerCase();

  for (let intent of intents) {
    for (let pattern of intent.patterns) {
      if (msg.includes(pattern.toLowerCase())) {
        return intent;
      }
    }
  }

  // Fallback if nothing matches
  return intents.find(i => i.intent === "fallback");
}

// ============================
// 🚀 API Endpoints
// ============================
app.post("/chat", (req, res) => {
  const userMessage = req.body.message || "";
  const intent = getIntent(userMessage);

  // Pick random response
  const response =
    intent.responses[Math.floor(Math.random() * intent.responses.length)];

  res.json({
    reply: response
  });
});

app.get("/", (req, res) => {
  res.send("📱 Repair & Buyback Chatbot is running...");
});

// ============================
// 🏁 Start Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
