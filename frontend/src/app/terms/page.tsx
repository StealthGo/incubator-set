import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF8] text-gray-900 py-16 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-[#37C2C4]">Terms & Conditions</h1>
        <div className="prose prose-lg text-gray-800">
          <h2 className="text-2xl font-semibold text-[#37C2C4] mb-4">Welcome to The Modern Chanakya</h2>
          <p>
            We are a technology platform that acts as a bridge between travelers and a curated network of third-party travel service providers. By using our platform, you acknowledge and agree to the following terms and conditions.
          </p>
          <h3 className="text-xl font-bold mt-8 mb-2 text-[#37C2C4]">General Terms & Conditions</h3>
          <ul className="list-disc pl-6">
            <li><strong>Our Role as a Technology Platform:</strong> The Modern Chanakya (TMC) is an aggregator that provides a highly personalized travel plan and a curated database of third-party services, including accommodations, experiences, and transportation. All bookings and services are provided by independent third-party partners.</li>
            <li><strong>Pricing & Payments:</strong> All prices displayed on our platform are set by our third-party partners. All bookings require full payment directly to the respective industry partner at the time of booking.</li>
            <li><strong>Liability & Redressal:</strong> The Modern Chanakya is a facilitator of information and transactions. We are not a service provider. As such, the third-party partners are solely responsible for providing the services as described. The Modern Chanakya is not liable for any acts, omissions, negligence, or issues related to the services, including, but not limited to, quality of service, safety, delays, or cancellations.</li>
            <li><strong>Traveler's Responsibility:</strong> Travelers are requested to take care of their personal belongings. The Modern Chanakya is not liable for the loss or theft of any belongings.</li>
            <li><strong>Agreement to Terms:</strong> By proceeding with a booking, you agree to the terms and conditions of both The Modern Chanakya and the respective third-party provider.</li>
          </ul>
          <h3 className="text-xl font-bold mt-8 mb-2 text-[#37C2C4]">Bookings & Cancellations</h3>
          <ul className="list-disc pl-6">
            <li><strong>Booking Process:</strong> All bookings are secured upon full payment directly to the third-party provider via their designated payment gateways.</li>
            <li><strong>Cancellation Policy:</strong> The booking and cancellation policy for each service is entirely determined by the respective third-party provider. We strongly advise you to review these policies before making a payment.</li>
            <li><strong>Unforeseen Circumstances:</strong> In the event of unforeseen circumstances, including government mandates or lockdowns, refunds and cancellations are subject to the policies of the third-party service provider.</li>
          </ul>
          <h3 className="text-xl font-bold mt-8 mb-2 text-[#37C2C4]">Grievances & Customer Support</h3>
          <ul className="list-disc pl-6">
            <li><strong>24/7 Concierge & Support:</strong> We provide a 24/7 live concierge and support service to assist you with any queries or feedback.</li>
            <li><strong>Grievance Redressal:</strong> While The Modern Chanakya is not liable for issues with third-party services, we commit to acting as a point of contact for grievance redressal. We will assist you in communicating with the third-party provider to find a solution, but we cannot guarantee an outcome.</li>
          </ul>
          <h3 className="text-xl font-bold mt-8 mb-2 text-[#37C2C4]">Payment Details</h3>
          <ul className="list-disc pl-6">
            <li>As a technology platform, The Modern Chanakya does not directly process or hold traveler payments for third-party services. All payments are securely processed by our partners' payment gateways.</li>
            <li>All amounts are payable directly to the third-party providers as specified in your booking summary.</li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-[#37C2C4]">We are delighted to facilitate your journey and wish you an amazing and unforgettable experience.</p>
        </div>
      </div>
    </main>
  );
}
