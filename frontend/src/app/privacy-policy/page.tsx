export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-[#37C2C4] pb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-6">Effective Date: August 20, 2025</p>

        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-8">
          Your privacy is important to us. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our website and services.
        </p>

        {/* Section */}
        <h2 className="text-2xl font-semibold text-[#37C2C4] mt-6 mb-3">
          Information We Collect
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Personal Data (e.g., name, email, contact info)</li>
          <li>Usage Data (e.g., pages visited, time spent, device info)</li>
          <li>Location Data (with your permission)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#37C2C4] mt-6 mb-3">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>To provide and improve our services</li>
          <li>To communicate with you</li>
          <li>To personalize your experience</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#37C2C4] mt-6 mb-3">
          Sharing Your Information
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We do not sell your personal information. We may share data with trusted partners 
          to help us operate our website and services, or as required by law.
        </p>

        <h2 className="text-2xl font-semibold text-[#37C2C4] mt-6 mb-3">
          Your Rights
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Access, update, or delete your personal data</li>
          <li>Opt out of marketing communications</li>
          <li>Request a copy of your data</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#37C2C4] mt-6 mb-3">
          Contact Us
        </h2>
        <p className="text-gray-700">
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:humans@tmchanakya.com" className="text-[#37C2C4] font-medium hover:underline">
            humans@tmchanakya.com
          </a>.
        </p>
      </div>
    </div>
  );
}
