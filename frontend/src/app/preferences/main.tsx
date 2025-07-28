"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import Image from 'next/image';

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:8000"; // Your backend URL

// --- Enhanced & Full-Fledged Sample Itinerary Data (Indian Context) ---
interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  local_guide_tip: string;
  icon?: string;
  image_url?: string;
  google_maps_link?: string;
  booking_link?: string;
  search_link?: string;
}

interface Meal {
  dish: string;
  restaurant: string;
  description: string;
  image_url: string;
  zomato_link: string;
}

interface DayItinerary {
  date: string;
  theme: string;
  activities: Activity[];
  meals?: {
    lunch?: Meal;
    dinner?: Meal;
    breakfast?: Meal;
  };
}

interface ItineraryData {
  hero_image_url: string;
  destination_name: string;
  personalized_title: string;
  journey_details?: {
    title: string;
    options: Array<{
      mode: string;
      icon: string;
      description: string;
      duration: string;
      estimated_cost: string;
      booking_link: string;
    }>;
  };
  accommodation_suggestions?: Array<{
    name: string;
    type: string;
    icon: string;
    description: string;
    estimated_cost: string;
    booking_link: string;
    image_url: string;
  }>;
  trip_overview?: {
    destination_insights: string;
    weather_during_visit: string;
    seasonal_context: string;
    cultural_context: string;
    local_customs_to_know: string[];
    estimated_total_cost: string;
  };
  daily_itinerary?: DayItinerary[];
  hidden_gems?: Array<{
    name: string;
    description: string;
    why_special: string;
    search_link: string;
  }>;
  signature_experiences?: Array<{
    name: string;
    description: string;
    why_local_loves_it: string;
    estimated_cost: string;
    booking_link: string;
  }>;
  hyperlocal_food_guide?: Array<{
    dish: string;
    description: string;
    where_to_find: string;
    local_tip: string;
    search_link: string;
  }>;
  shopping_insider_guide?: Array<{
    item: string;
    where_to_buy: string;
    local_tip: string;
    search_link: string;
  }>;
  practical_local_wisdom?: Record<string, string | string[]>;
}

const mockItinerary: ItineraryData = {
  hero_image_url: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  destination_name: "Goa",
  personalized_title: "Satyam's Unforgettable Goa Getaway",

  journey_details: {
    title: "Travel Plan from Guna to Goa",
    options: [
      {
        mode: "Flight",
        icon: "flight",
        description: "The fastest route. Fly from nearby Bhopal (BHO) or Gwalior (GWL) to Goa International Airport (GOI).",
        duration: "Approx. 2-3 hours flight time",
        estimated_cost: "₹5,000 - ₹10,000",
        booking_link: "https://www.makemytrip.com/flights/"
      },
      {
        mode: "Train",
        icon: "train",
        description: "A budget-friendly and scenic journey. Board from Guna (GUNA) or Ruthiyai (RTA) to Madgaon (MAO) or Vasco da Gama (VSG).",
        duration: "Approx. 24-30 hours",
        estimated_cost: "₹800 - ₹3,000",
        booking_link: "https://www.makemytrip.com/railways/"
      }
    ]
  },
  
  accommodation_suggestions: [
      { name: "Taj Fort Aguada Resort & Spa", type: "Luxury Resort", icon: "hotel_class", description: "For ultimate luxury with stunning sea views and impeccable service.", estimated_cost: "₹15,000+/night", booking_link: "https://www.makemytrip.com/hotels/taj-fort-aguada-resort-and-spa-goa-hotel-in-goa.html", image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/113048694.jpg?k=2013b6b7cb78033886556aba5e0fac23fa2a477c106c23d6afecd2886bb81b73&o=&hp=1" },
      { name: "W Goa", type: "Chic & Modern", icon: "nightlife", description: "Perfect for a trendy, vibrant stay with a party atmosphere.", estimated_cost: "₹12,000+/night", booking_link: "https://www.makemytrip.com/hotels/w-goa-hotel-in-goa.html", image_url: "https://cache.marriott.com/content/dam/marriott-renditions/GOIWH/goiwh-rockpool-twilight-3537-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1300px:*" },
      { name: "The Postcard Velha", type: "Boutique & Heritage", icon: "palette", description: "Experience old-world charm in a beautifully restored colonial estate.", estimated_cost: "₹10,000+/night", booking_link: "https://www.makemytrip.com/hotels/the-postcard-velha-goa-hotel-in-goa.html", image_url: "https://media-cdn.tripadvisor.com/media/photo-s/18/99/fa/5a/the-postcard-velha.jpg" },
      { name: "Radisson Blu Resort Goa", type: "Luxury Resort", icon: "groups", description: "Plush accommodation, premium amenities, Portuguese architecture and a pleasant stay experience await you at the Radisson Blu Resort, Goa", estimated_cost: "₹12000+/night", booking_link: "https://www.makemytrip.com/hotels/anjoned-cafe-and-hostel-hostel-in-goa.html", image_url: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201111231032352264-3a2157a2fabb11ed84390a58a9feac02.jpg?&output-quality=75&crop=520:350;2,0&output-format=jpg&downsize=540:*" }
  ],

  trip_overview: {
    destination_insights: "Goa is not just about beaches; it's a vibrant blend of Indian and Portuguese cultures, spiritual retreats, and lush nature. As a local, I can tell you the real magic is in the quiet southern villages and the bustling flea markets up north.",
    weather_during_visit: "Expect sunny days with temperatures around 28-32°C. Evenings are pleasant and breezy, perfect for beachside dinners.",
    seasonal_context: "You're visiting in a great season! The post-monsoon greenery is lush, and the main tourist rush hasn't started yet, offering a more relaxed experience.",
    cultural_context: "Look out for local temple festivals (jatras) which are common during this time. It's a glimpse into the authentic Goan way of life.",
    local_customs_to_know: ["Respect religious sites by dressing modestly.", "Bargaining is common in markets, but always be polite."],
    estimated_total_cost: "₹25,000 - ₹35,000 per person (excluding flights)"
  },
  daily_itinerary: [
    {
      date: "2024-10-10",
      theme: "North Goa Vibes & Flea Market Finds",
      activities: [
        { time: "09:00 AM", activity: "Breakfast at Baba Au Rhum", location: "Anjuna", description: "A charming French bakery tucked away in a serene, green corner of Anjuna. It's the perfect spot to start your Goan holiday with delicious croissants, pastries, and coffee.", local_guide_tip: "It's a bit hidden, which is why it's so peaceful. Their croissants and fresh juices are the perfect fuel for the day. Go early to grab the best seats by the creek.", icon: "local_cafe", image_url: "https://i.guim.co.uk/img/media/5ff7209473155763d2b948bedaa9fedfb365fd3d/0_37_640_384/master/640.jpg?width=1900&dpr=2&s=none&crop=none", google_maps_link: "https://www.google.com/maps/search/?api=1&query=Baba+Au+Rhum+Anjuna", search_link: "https://www.zomato.com/goa/baba-au-rhum-anjuna" },
        { time: "11:00 AM", activity: "Explore Anjuna Flea Market", location: "Anjuna Beach", description: "A legendary Wednesday market that's a sensory overload in the best way. You'll find everything from handmade jewelry and clothes to spices and souvenirs.", local_guide_tip: "Don't be afraid to bargain, but do it with a smile. Look for unique handmade jewelry and leather goods. The market gets crowded, so keep your belongings safe.", icon: "storefront", image_url: "https://media1.thrillophilia.com/filestore/im5nqd5xl4j7dxsmgcbh3bxxgyin_1574855580_1_6ozxU8h6ehzSascJU5Olhw.jpeg?w=1440&dpr=2", google_maps_link: "https://www.google.com/maps/search/?api=1&query=Anjuna+Flea+Market", search_link: "https://www.google.com/maps/search/?api=1&query=Anjuna+Flea+Market" },
        { time: "05:00 PM", activity: "Sunset at Vagator Beach", location: "Vagator", description: "Vagator is known for its dramatic red cliffs and stunning sunset views. It's split into two main beaches: Big Vagator and Little Vagator.", local_guide_tip: "For the best view, climb up to Chapora Fort (the 'Dil Chahta Hai' fort). The panoramic view of the coast as the sun sets is truly magical and worth the small trek.", icon: "camera_alt", image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/e5/03/bd/img-20181104-094252-largejpg.jpg?w=1000&h=600&s=1", google_maps_link: "https://www.google.com/maps/search/?api=1&query=Vagator+Beach+Goa", search_link: "https://www.google.com/maps/search/?api=1&query=Vagator+Beach+Goa" }
      ],
      meals: {
          lunch: { dish: "Goan Fish Thali", restaurant: "Vinayak Family Restaurant", description: "An authentic, no-frills thali that's a local favourite.", image_url: "https://static.wixstatic.com/media/798804_2c52eea0fee94049ad5ba69a8d0ed6fb~mv2.webp/v1/fill/w_925,h_520,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/798804_2c52eea0fee94049ad5ba69a8d0ed6fb~mv2.webp", zomato_link: "https://www.zomato.com/goa/vinayak-family-restaurant-assagao" },
          dinner: { dish: "Seafood Platter", restaurant: "Curlies Beach Shack", description: "Dine with your feet in the sand at this legendary shack.", image_url: "https://img.taste.com.au/c5tpX1pj/w720-h480-cfill-q80/taste/2019/11/seafood-platter-taste-156004-2.jpg", zomato_link: "https://www.zomato.com/goa/curlies-beach-shack-anjuna" }
      }
    },
    {
      date: "2024-10-11",
      theme: "Heritage Trail in Old Goa & Panjim",
      activities: [
        { time: "10:00 AM", activity: "Visit Old Goa Churches", location: "Old Goa", 
          description: "Step back in time in Old Goa, a UNESCO World Heritage site. The area is filled with magnificent churches and cathedrals from the Portuguese era.", 
          local_guide_tip: "Don't just see the Basilica of Bom Jesus; spend time at the quieter Se Cathedral and the ruins of St. Augustine Tower. Hire a local guide there for fascinating stories.", icon: "church", 
          image_url: "https://cdn.britannica.com/10/252410-050-CE919B39/basilica-born-jesus-borea-jezuchi-bajilika-old-goa-india.jpg", google_maps_link: "https://www.google.com/maps/search/?api=1&query=Old+Goa+Churches", search_link: "https://www.google.com/maps/search/?api=1&query=Old+Goa+Churches" },
        { time: "04:00 PM", activity: "Walk through Fontainhas", location: "Panjim", description: "The charming Latin Quarter of Goa's capital. Its narrow, winding streets are lined with colourful Portuguese-style villas and art galleries.", local_guide_tip: "Get lost in the colourful lanes. Look for the small, traditional bakeries selling Goan sweets like Bebinca and Dodol. It's a photographer's paradise!", icon: "palette", image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/53/4e/3f/img20201115163646-largejpg.jpg?w=1000&h=600&s=1", google_maps_link: "https://www.google.com/maps/search/?api=1&query=Fontainhas+Panjim", search_link: "https://www.google.com/maps/search/?api=1&query=Fontainhas+Panjim" }
      ],
      meals: {
          lunch: { dish: "Prawn Balchão", restaurant: "The Goan Room", description: "A fiery and tangy prawn pickle dish, a true Goan delicacy.", image_url: "https://www.thespruceeats.com/thmb/8-LYDIaDAqyDy2YzPm3MT8rMqJs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/goan-prawn-balchao-1957451-hero-01-91d750c35f6545269350a483ef61b90f.jpg", zomato_link: "https://www.zomato.com/goa/the-goan-room-panaji" },
          dinner: { dish: "Crab Xec Xec", restaurant: "Fisherman's Wharf", description: "A rich, roasted coconut curry with crab. It's messy but absolutely worth it.", image_url: "https://deliciousmemorieswithalves.wordpress.com/wp-content/uploads/2018/06/crab-xec-xec.jpg", zomato_link: "https://www.zomato.com/goa/fishermans-wharf-panaji" }
      }
    }
  ],
  hidden_gems: [
      { name: "Harvalem Waterfall", description: "A beautiful, lesser-known waterfall, especially lush after the monsoon. There's an ancient cave temple nearby.", why_special: "Offers a serene escape from the crowded beaches.", search_link: "https://www.google.com/search?q=Harvalem+Waterfall+Goa" },
      { name: "Divar Island", description: "Take a ferry to this sleepy island to experience old-world Goan village life and stunning paddy fields.", why_special: "It feels like stepping back in time.", search_link: "https://www.google.com/search?q=Divar+Island+Goa" }
  ],
  signature_experiences: [
    { name: "Spice Plantation Tour", description: "Walk through a lush spice farm, learn about local spices, and enjoy a traditional Goan lunch.", why_local_loves_it: "It's a refreshing break from the beaches and a treat for the senses.", estimated_cost: "₹800 - ₹1500 per person", booking_link: "https://www.makemytrip.com/activities/goa/sahakari-spice-farm-tour.html" },
    { name: "Kayaking in the Backwaters", description: "A peaceful experience paddling through the serene backwaters and mangroves of the Sal or Nerul river.", why_local_loves_it: "You get to see a completely different, tranquil side of Goa, away from the chaos.", estimated_cost: "₹1000 - ₹2000 per person", booking_link: "https://www.makemytrip.com/activities/goa/kayaking-in-goa.html" }
  ],
  hyperlocal_food_guide: [
    { dish: "Bebinca", description: "A traditional multi-layered Goan dessert, a true labour of love.", where_to_find: "Local bakeries in Panjim or Mapusa.", local_tip: "Best enjoyed with a scoop of vanilla ice cream.", search_link: "https://www.zomato.com/goa/restaurants/desserts/bebinca" },
    { dish: "Fish Recheado", description: "A whole fish stuffed with a tangy red masala and pan-fried to perfection.", where_to_find: "Vinayak Family Restaurant, Assagao.", local_tip: "Ask for the catch of the day for the freshest fish.", search_link: "https://www.zomato.com/goa/vinayak-family-restaurant-assagao" }
  ],
  shopping_insider_guide: [
    { item: "Cashew Nuts", where_to_buy: "Zantye's in Panjim", local_tip: "Try the salted and masala varieties. They offer samples!", search_link: "https://www.google.com/search?q=Zantye's+Cashew+Panjim" },
    { item: "Azulejos (Painted Tiles)", where_to_buy: "Galleries in Fontainhas, Panjim", local_tip: "These make for beautiful, unique souvenirs that capture the Portuguese influence.", search_link: "https://www.google.com/search?q=Azulejos+tiles+Fontainhas" }
  ],
  practical_local_wisdom: {
    safety_tips: "Avoid poorly lit areas on beaches at night. Stick to reputable taxi services or use the Goa Miles app.",
    health_and_wellness: "Drink bottled water and be cautious with street food if you have a sensitive stomach. Carry sunscreen!",
    connectivity: "Get a local SIM card at the airport for the best network coverage. Jio and Airtel work best.",
    transport: "Renting a scooter is the most popular way to explore. Ensure you have a valid license and always wear a helmet."
  }
};

const systemQuestions = [
  { key: "destination", text: "Where would you like to go for your next trip?" },
  { key: "dates", text: "What dates are you planning for?" },
  { key: "travelers", text: "Who is travelling with you?" },
  { key: "interests", text: "What are your primary interests for this trip?" },
  { key: "budget", text: "What is your approximate budget (Low, Medium, High)?" },
  { key: "pace", text: "What pace would you prefer (Relaxed, Balanced, or Packed)?" },
  { key: "aboutYou", text: "Anything else you'd like to share?" },
];

const quickReplies: Record<string, string[]> = {
  destination: ["Delhi", "Mumbai", "Leh", "Goa", "Jaipur", "Kerala"],
  dates: ["Choose Date", "Flexible"],
  travelers: ["Just me", "Friends", "Family", "Big group"],
  interests: ["Adventure", "Food", "Culture", "Nature", "Relaxation", "Nightlife"],
  budget: ["Low", "Medium", "High"],
  pace: ["Relaxed", "Balanced", "Packed"],
};

// --- Helper Functions & Components ---

const getRandomFlexibleDates = () => {
  const today = new Date();
  const startOffset = Math.floor(Math.random() * 20) + 1;
  const startDate = addDays(today, startOffset);
  const endDate = addDays(startDate, 4);
  return `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
};

const Icon = ({ name, className }: { name: string, className?: string }) => (
  <span className={`material-icons-outlined ${className}`}>{name}</span>
);

const ChatBubble = ({ sender, children }: { sender: string, children: React.ReactNode }) => {
  const align = sender === 'user' ? 'justify-end' : 'justify-start';
  const bubbleColor = sender === 'user'
    ? 'bg-orange-500 text-white'
    : 'bg-orange-50 text-orange-900 border border-orange-200';
  const shape = sender === 'user' ? 'rounded-2xl rounded-br-none' : 'rounded-2xl rounded-bl-none';
  return (
    <div className={`flex ${align} w-full mb-1`}>
      <div className={`px-4 py-2 max-w-xs md:max-w-md text-sm shadow flex items-center ${bubbleColor} ${shape}`}>
        {children}
      </div>
    </div>
  );
};

// --- Authentication Modal ---
function SignInModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const res = await fetch(`${API_BASE_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign in failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      setLoading(false);
      onSuccess();
      onClose();
    } catch {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSignUpSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign up failed");
        setLoading(false);
        return;
      }
      setSignUpSuccess("Sign up successful! Please sign in.");
      setShowSignUp(false);
      setError("");
      setLoading(false);
    } catch {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative z-10 w-full max-w-sm bg-white/95 rounded-xl shadow-xl p-8 backdrop-blur-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-orange-700 drop-shadow">{showSignUp ? 'Sign Up' : 'Sign In'}</h1>
        {signUpSuccess && <div className="mb-2 text-green-600 text-sm text-center font-semibold">{signUpSuccess}</div>}
        <form className="flex flex-col gap-4" onSubmit={showSignUp ? handleSignUp : handleSignIn}>
          {showSignUp && (
            <>
              <input type="text" placeholder="Name" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={name} onChange={e => setName(e.target.value)} />
              <input type="date" placeholder="Date of Birth" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={dob} onChange={e => setDob(e.target.value)} />
            </>
          )}
          <input type="email" placeholder="Email" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-full font-bold text-lg shadow hover:bg-orange-600 transition-all" disabled={loading}>{loading ? (showSignUp ? "Signing Up..." : "Signing In...") : (showSignUp ? "Sign Up" : "Sign In")}</button>
        </form>
        {error && <div className="mt-2 text-red-600 text-sm text-center font-semibold">{error}</div>}
        <div className="flex flex-col items-center mt-4 gap-2">
          <button onClick={onClose} className="text-sm text-gray-600 hover:underline w-full font-medium">Cancel</button>
          <button onClick={() => { setShowSignUp(s => !s); setError(""); setSignUpSuccess(""); }} className="text-sm text-orange-700 hover:underline w-full font-medium">
            {showSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function PreferencesPage() {
  const [messages, setMessages] = useState([
    { sender: "system", text: systemQuestions[0].text },
  ]);
  const [input, setInput] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(mockItinerary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [step, setStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, value?: string) => {
    if (e) e.preventDefault();
    const currentInput = value || input;
    if (!currentInput.trim()) return;

    if (itinerary) {
        setItinerary(null);
    }

    const key = systemQuestions[step]?.key;
    if (key === 'dates' && !itinerary) {
        if(currentInput === "Choose Date") {
            setShowDatePicker(true);
            return;
        }
        if(currentInput === "Flexible") {
            const randomDates = getRandomFlexibleDates();
            setMessages((msgs) => [...msgs, { sender: "user", text: randomDates }]);
            setInput("");
             if (step < systemQuestions.length - 1) {
                setTimeout(() => {
                    setMessages((msgs) => [...msgs, { sender: "system", text: systemQuestions[step + 1].text }]);
                    setStep(step + 1);
                }, 400);
            } else {
                setShowOptions(true);
            }
            return;
        }
    }
    
    setMessages((msgs) => [...msgs, { sender: "user", text: currentInput }]);
    setInput("");

    if (step < systemQuestions.length - 1) {
        setTimeout(() => {
          setMessages((msgs) => [...msgs, { sender: "system", text: systemQuestions[step + 1].text }]);
          setStep(step + 1);
        }, 400);
    } else {
        setShowOptions(true);
    }
  };

  const handleGenerate = async (followUpPrompt?: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setShowSignInModal(true);
      return;
    }

    setIsGenerating(true);
    setShowOptions(false);

    const generatingMessage = followUpPrompt 
        ? "Updating your itinerary based on your request..."
        : "Creating your hyper-detailed travel itinerary with local insights...";
    setMessages((msgs) => [...msgs, { sender: "llm", text: generatingMessage }]);

    const requestBody = {
      messages: followUpPrompt ? [...messages, { sender: 'user', text: followUpPrompt }] : messages,
      current_itinerary: itinerary
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        if (res.status === 429) {
          // Quota exceeded
          setMessages((msgs) => [
            ...msgs,
            { sender: "llm", text: "I'm currently experiencing high demand. Please try again in a few minutes, or consider upgrading to a premium plan for faster access." },
          ]);
          setIsGenerating(false);
          return;
        }
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setItinerary(data.itinerary);
      setMessages((msgs) => [
        ...msgs,
        { sender: "llm", text: data.llm_message || "Your itinerary is ready! Check it out on the right." },
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setMessages((msgs) => [
        ...msgs,
        { sender: "llm", text: `Sorry, there was an error: ${errorMessage}. Please try again.` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDateSelect = (ranges: { selection: { startDate: Date; endDate: Date } }) => {
    const { startDate, endDate } = ranges.selection;
    const formatted = `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
    setShowDatePicker(false);
    handleSend(undefined, formatted);
  };

  const handleAskMore = () => {
    setMessages((msgs) => [...msgs, { sender: "system", text: "What else would you like to share or ask?" }]);
    setShowOptions(false);
  };

  const renderItinerary = () => {
    if (isGenerating && !itinerary) {
      return <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Crafting your perfect journey...</p>
      </div>;
    }
    if (!itinerary) {
      return (
        <div className="text-gray-700 text-center mt-16 p-4">
          <Icon name="explore" className="text-5xl mb-4" />
          <div className="text-lg font-medium mb-2">Your Detailed Itinerary Will Appear Here</div>
          <div className="text-sm">Complete the chat to get a comprehensive travel plan with:</div>
          <div className="text-sm mt-2 space-y-1 text-left inline-block">
            <div><Icon name="map" className="text-sm mr-2 text-orange-500"/>Day-by-day detailed schedule</div>
            <div><Icon name="restaurant" className="text-sm mr-2 text-orange-500"/>Local food recommendations</div>
            <div><Icon name="star" className="text-sm mr-2 text-orange-500"/>Signature experiences</div>
            <div><Icon name="shopping_cart" className="text-sm mr-2 text-orange-500"/>Shopping guides & insider tips</div>
            <div><Icon name="account_balance_wallet" className="text-sm mr-2 text-orange-500"/>Budget breakdown & practical wisdom</div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-12 p-4 md:p-0">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden shadow-2xl h-80">
            <Image 
              src={itinerary.hero_image_url} 
              alt={itinerary.destination_name} 
              fill 
              className="object-cover" 
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <h2 className="absolute bottom-8 left-8 text-5xl font-extrabold text-white drop-shadow-lg">
                {itinerary.personalized_title || `Your Trip to ${itinerary.destination_name}`}
            </h2>
        </section>

        {/* Journey Details */}
        {itinerary.journey_details && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="luggage" className="text-4xl text-orange-500"/> {itinerary.journey_details.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.journey_details.options.map((opt, i: number) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-3">
                                <Icon name={opt.icon} className="text-3xl text-orange-600"/>
                                <h4 className="font-bold text-xl text-gray-800">{opt.mode}</h4>
                            </div>
                            <p className="text-gray-700 mb-2">{opt.description}</p>
                            <p className="text-sm text-gray-600 mb-4"><strong>Duration:</strong> {opt.duration}</p>
                            <div className="flex justify-between items-center">
                                <p className=" text-gray-700 font-semibold text-lg">{opt.estimated_cost}</p>
                                <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                    <Icon name="confirmation_number" /> Book Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
        
        {/* Accommodation Suggestions */}
        {itinerary.accommodation_suggestions && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="hotel" className="text-4xl text-orange-500"/> Accommodation Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.accommodation_suggestions.map((opt, i: number) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                            <div className="relative h-48">
                                <Image src={opt.image_url} alt={opt.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw"/>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <Icon name={opt.icon} className="text-3xl text-orange-600"/>
                                    <div>
                                        <h4 className="font-bold text-xl text-gray-800">{opt.name}</h4>
                                        <p className="text-sm text-gray-800">{opt.type}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{opt.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-700 font-semibold text-lg">{opt.estimated_cost}</p>
                                    <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="bg-orange-500  font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                        <Icon name="hotel" /> Book on MMT
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Trip Overview */}
        {itinerary.trip_overview && (
          <section className="bg-orange-50 rounded-2xl p-6 shadow-lg border border-orange-200">
            <h3 className="text-3xl font-bold text-orange-800 mb-4 flex items-center gap-3"><Icon name="info" className="text-4xl"/> Trip Overview</h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{itinerary.trip_overview.destination_insights}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
              <div className="text-gray-700 flex items-center gap-3"><Icon name="thermostat" className="text-orange-600" /><div><strong>Weather:</strong> {itinerary.trip_overview.weather_during_visit}</div></div>
              <div className="text-gray-700 flex items-center gap-3"><Icon name="calendar_today" className="text-orange-600" /><div><strong>Season:</strong> {itinerary.trip_overview.seasonal_context}</div></div>
              <div className="text-gray-700 flex items-center gap-3"><Icon name="festival" className="text-orange-600" /><div><strong>Culture:</strong> {itinerary.trip_overview.cultural_context}</div></div>
              <div className="text-gray-700 flex items-center gap-3"><Icon name="group" className="text-orange-600" /><div><strong>Customs:</strong> {Array.isArray(itinerary.trip_overview.local_customs_to_know) ? itinerary.trip_overview.local_customs_to_know.join(', ') : 'N/A'}</div></div>
            </div>
            <div className="text-orange-900 font-bold mt-6 text-xl text-right">Estimated Cost: {itinerary.trip_overview.estimated_total_cost}</div>
          </section>
        )}

        {/* Daily Itinerary */}
        {itinerary.daily_itinerary && (
          <section>
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="map" className="text-4xl text-orange-500"/> Daily Itinerary</h3>
            <div className="space-y-8">
              {itinerary.daily_itinerary.map((day: DayItinerary, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="bg-orange-400 text-white p-4">
                    <h4 className="font-bold text-xl">{`Day ${idx + 1}: ${day.date}`}</h4>
                    <p className="text-sm opacity-90">{day.theme}</p>
                  </div>
                  <div className="p-6">
                    <h5 className="font-bold text-xl text-gray-700 mb-4">Activities</h5>
                    <div className="space-y-6">
                        {day.activities.map((activity: Activity, actIdx: number) => (
                          <div key={actIdx} className="flex gap-4 items-start">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="bg-orange-100 text-orange-700 rounded-full h-12 w-12 flex items-center justify-center">
                                    <Icon name={activity.icon || "place"} />
                                </div>
                                {actIdx < day.activities.length - 1 && <div className="w-px h-full bg-gray-200 mt-2"></div>}
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-semibold text-gray-500">{activity.time}</p>
                              <p className="font-bold text-lg text-gray-800">{activity.activity}</p>
                              <div className="text-sm text-gray-600 flex items-center gap-1"><Icon name="location_on" className="text-sm"/> {activity.location}</div>
                              <div className="mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <p className="font-bold text-sm text-amber-800 mb-1">Local Guide Tip:</p>
                                <p className="text-base text-amber-700 italic">&ldquo;{activity.local_guide_tip}&rdquo;</p>
                              </div>
                               {activity.image_url && (
                                <div className="mt-4 rounded-xl overflow-hidden shadow-md">
                                    <Image src={activity.image_url} alt={activity.activity} width={800} height={600} className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                               )}
                               <div className="mt-4">
                                   <a href={activity.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold inline-flex items-center gap-1">
                                       <Icon name="map"/> Google Maps
                                   </a>
                               </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {day.meals && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                             <h5 className="font-bold text-xl text-gray-700 mb-4">Meal Recommendations</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(day.meals).map(([mealType, meal]) => {
                                  const mealData = meal as Meal;
                                  return (
                                    <div key={mealType} className="bg-gray-50 rounded-xl p-4 shadow-md">
                                        <p className="font-bold text-gray-800 capitalize">{mealType}</p>
                                        <Image src={mealData.image_url} alt={mealData.dish} width={400} height={200} className="w-full h-40 object-cover rounded-lg my-2"/>
                                        <p className="text-gray-700  font-semibold text-lg">{mealData.dish}</p>
                                        <p className="text-sm text-gray-600">{mealData.restaurant}</p>
                                        <p className="text-sm text-gray-500 my-2 italic">&ldquo;{mealData.description}&rdquo;</p>
                                        <a href={mealData.zomato_link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline font-semibold inline-flex items-center gap-1">
                                            <Icon name="restaurant_menu"/> View on Zomato
                                        </a>
                                    </div>
                                  );
                                })}
                             </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Hidden Gems Section */}
        {itinerary.hidden_gems && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="diamond" className="text-4xl text-orange-500"/> Hidden Gems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.hidden_gems.map((gem, i: number) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h4 className="font-bold text-xl text-gray-800 mb-2">{gem.name}</h4>
                            <p className="text-gray-700 mb-3">{gem.description}</p>
                            <p className="text-sm text-orange-800 bg-orange-100 p-2 rounded-lg italic"><strong>Why it&apos;s special:</strong> {gem.why_special}</p>
                            <a href={gem.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                                <Icon name="map"/> Find on Map
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Other Sections in a Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Signature Experiences */}
            {itinerary.signature_experiences && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="star" className="text-4xl text-orange-500"/> Signature Experiences</h3>
                <div className="space-y-6">
                {itinerary.signature_experiences.map((exp, i: number) => (
                    <div key={i} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-2">{exp.name}</div>
                    <p className="text-gray-700 text-base mb-3">{exp.description}</p>
                    <div className="text-base text-orange-800 bg-orange-200/50 p-3 rounded-lg italic"><strong>Local&apos;s Take:</strong> {exp.why_local_loves_it}</div>
                    <div className="flex justify-between items-center mt-4">
                        <p className="font-bold text-lg text-gray-500">{exp.estimated_cost}</p>
                        <a href={exp.booking_link} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                            <Icon name="confirmation_number"/> Book Experience
                        </a>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Hyperlocal Food Guide */}
            {itinerary.hyperlocal_food_guide && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="restaurant" className="text-4xl text-orange-500"/> Hyperlocal Food Guide</h3>
                <div className="space-y-6">
                {itinerary.hyperlocal_food_guide.map((food, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">{food.dish}</div>
                    <p className="text-gray-700 text-base mb-2">{food.description}</p>
                    <p className="text-base text-gray-600 mb-3"><strong>Find it at:</strong> {food.where_to_find}</p>
                    <div className="text-base text-green-800 bg-green-100/60 p-3 rounded-lg italic"><strong>Tip:</strong> {food.local_tip}</div>
                    <a href={food.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                        <Icon name="restaurant_menu"/> Check on Zomato
                    </a>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Shopping Guide */}
            {itinerary.shopping_insider_guide && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="shopping_cart" className="text-4xl text-orange-500"/> Shopping Insider Guide</h3>
                <div className="space-y-6">
                {itinerary.shopping_insider_guide.map((shop, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">{shop.item}</div>
                    <p className="text-gray-700 text-base mb-2"><strong>Where to buy:</strong> {shop.where_to_buy}</p>
                    <div className="text-base text-blue-800 bg-blue-100/60 p-3 rounded-lg italic"><strong>Tip:</strong> {shop.local_tip}</div>
                    <a href={shop.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                        <Icon name="search"/> Search Online
                    </a>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Practical Wisdom */}
            {itinerary.practical_local_wisdom && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="lightbulb" className="text-4xl text-orange-500"/> Practical Wisdom</h3>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-base space-y-4 shadow-lg">
                    {Object.entries(itinerary.practical_local_wisdom).map(([key, value]) => (
                        <div key={key} className="flex items-start">
                            <strong className="capitalize text-green-900 w-1/3">{key.replace(/_/g, ' ')}:</strong>
                            <span className="text-gray-700 ml-2 w-2/3">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                    ))}
                </div>
            </section>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-100 font-sans flex flex-col ${showSignInModal ? 'overflow-hidden' : ''}`}>
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Icon name="travel_explore" className="text-orange-500" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-orange-500">Chanakya</span></span>
          </button>
        </div>
        <button onClick={() => { setItinerary(null); setMessages([{ sender: 'system', text: systemQuestions[0].text }]); setStep(0); }} className="px-5 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-all text-sm">
            New Trip
        </button>
      </nav>

      <div className="flex flex-col md:flex-row w-full flex-1" style={{ height: 'calc(100vh - 81px)' }}>
        {/* Left: Chat Section */}
        <section className={`w-full md:w-2/5 flex flex-col bg-white p-4 md:p-6 border-r border-gray-200 ${showFullItinerary ? 'hidden md:flex' : ''}`}>
          <div className="flex-1 flex flex-col justify-end overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-4 mb-4">
              {messages.map((msg, i) => <ChatBubble key={i} sender={msg.sender}>{msg.text}</ChatBubble>)}
              <div ref={chatEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="mt-auto pt-4">
            {showDatePicker && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20 z-30">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
                  <DateRange
                    editableDateInputs
                    onChange={handleDateSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={[{ startDate: new Date(), endDate: addDays(new Date(), 6), key: 'selection' }]}
                    minDate={new Date()}
                  />
                </div>
              </div>
            )}
            {!itinerary && !showOptions && quickReplies[systemQuestions[step]?.key]?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {quickReplies[systemQuestions[step]?.key].map((option) => (
                  <button key={option} type="button" className="px-4 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200 transition text-sm font-semibold" onClick={() => handleSend(undefined, option)}>
                    {option}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input type="text" className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder={itinerary ? "Any changes? Type here..." : "Type your answer..."} value={input} onChange={e => setInput(e.target.value)} disabled={isGenerating} />
              <button type="submit" className="p-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-all" disabled={isGenerating}>
                <Icon name="send" />
              </button>
            </form>
             {showOptions && (
                <div className="flex gap-4 mt-4">
                <button onClick={handleAskMore} className="px-5 py-2 rounded-full bg-gray-200 text-gray-900 font-semibold shadow hover:bg-gray-300 transition-all text-sm">Ask More</button>
                <button onClick={() => handleGenerate()} className="px-5 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-all text-sm" disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate Itinerary"}
                </button>
                </div>
            )}
          </div>
        </section>

        {/* Right: Itinerary Output Section */}
        <section className={`w-full md:w-3/5 flex flex-col ${showFullItinerary ? 'w-full' : ''} h-full`}>
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Your Itinerary</h2>
                <button type="button" className="ml-auto px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold hover:bg-orange-200 transition-all text-xs flex items-center gap-1" onClick={() => setShowFullItinerary(v => !v)}>
                  <Icon name={showFullItinerary ? "chat" : "fullscreen"} className="text-sm"/>
                  {showFullItinerary ? "Show Chat" : "Full Page"}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 hide-scrollbar">
              {renderItinerary()}
            </div>
        </section>
      </div>

      <style jsx global>{`
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .rdrDay.rdrDaySelected, .rdrDay.rdrDayActive { background: #f97316 !important; }
        .rdrDay.rdrDayInRange, .rdrDay.rdrDayInPreview { background: #fed7aa !important; color: #c2410c !important; }
        .rdrDayToday .rdrDayNumber span { border: 1.5px solid #f97316 !important; }
      `}</style>
      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} onSuccess={() => handleGenerate()} />
      )}
    </div>
  );
}
