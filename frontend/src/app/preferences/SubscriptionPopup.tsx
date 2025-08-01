import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Star, Sparkles } from 'lucide-react';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLater?: () => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isOpen, onClose, onLater }) => {
  const plans = [
    {
      name: "Explorer",
      price: "₹199",
      period: "/month",
      originalPrice: "₹399",
      description: "Perfect for occasional travelers",
      features: [
        "5 detailed itineraries per month",
        "Basic AI travel planning",
        "Standard destination guides",
        "Email support",
        "Mobile app access"
      ],
      color: "blue",
      popular: false,
      discount: "50% OFF"
    },
    {
      name: "Wanderer Pro",
      price: "₹499",
      period: "/month", 
      originalPrice: "₹999",
      description: "For the serious travel enthusiast",
      features: [
        "Unlimited detailed itineraries",
        "Advanced AI with hyperlocal insights",
        "Priority customer support",
        "Custom travel preferences",
        "Exclusive hidden gems database",
        "Real-time travel updates",
        "Offline itinerary access",
        "Group travel coordination"
      ],
      color: "purple",
      popular: true,
      discount: "50% OFF LAUNCH SPECIAL"
    },
    {
      name: "Travel Master",
      price: "₹899",
      period: "/month",
      originalPrice: "₹1799",
      description: "Ultimate travel planning experience",
      features: [
        "Everything in Wanderer Pro",
        "Personal travel consultant calls",
        "VIP booking assistance",
        "Advanced expense tracking",
        "Premium travel insurance discounts",
        "24/7 emergency travel support",
        "Exclusive partner discounts",
        "Custom itinerary export formats"
      ],
      color: "gold",
      popular: false,
      discount: "50% OFF"
    }
  ];

  const handleLater = () => {
    // Set a flag to not show popup for next 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem('subscriptionPopupCooldown', tomorrow.toISOString());
    if (onLater) onLater();
    onClose();
  };

  const handleSubscribe = (planName: string) => {
    // Here you would integrate with your payment processor
    console.log(`Subscribing to ${planName}`);
    // For now, just close the popup
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 text-white p-8 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                >
                  <Crown className="w-8 h-8 text-yellow-300" />
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold mb-2"
                >
                  🎉 Your Amazing Itinerary is Ready!
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/90"
                >
                  Want to create unlimited itineraries and unlock exclusive travel insights? 
                  <br />
                  Join thousands of travelers who upgrade for the ultimate experience!
                </motion.p>
              </div>
            </div>

            {/* Plans */}
            <div className="p-8">
              {/* Limited Time Offer Banner */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg">LIMITED TIME OFFER</span>
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm">Launch Special: 50% OFF for the first 1000 users! Don't miss out!</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                    className={`relative bg-white border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                      plan.popular 
                        ? 'border-purple-500 shadow-purple-100 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {plan.discount && (
                      <div className="absolute -top-3 right-3">
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {plan.discount}
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 ml-1">{plan.period}</span>
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-400 line-through ml-2">{plan.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      onClick={() => handleSubscribe(plan.name)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.popular ? (
                        <span className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5" />
                          Choose Pro
                        </span>
                      ) : (
                        'Get Started'
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Banner */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-6 border border-orange-200"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Why Upgrade?</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Unlimited Planning</h4>
                    <p className="text-sm text-gray-600">Create as many itineraries as you want</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Premium Insights</h4>
                    <p className="text-sm text-gray-600">Access exclusive local recommendations</p>
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Crown className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Priority Support</h4>
                    <p className="text-sm text-gray-600">Get help when you need it most</p>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={handleLater}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors block mx-auto"
                >
                  Remind me tomorrow
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xs transition-colors block mx-auto"
                >
                  Continue with free plan (limited features)
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionPopup;
