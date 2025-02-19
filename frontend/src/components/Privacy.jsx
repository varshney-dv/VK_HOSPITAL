import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="mb-4">At VK Hospital, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our doctor appointment services.</p>
      
      <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
      <p className="mb-2">We collect the following types of information when you use our services:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Personal details (name, age, contact information, etc.).</li>
        <li>Medical history and appointment details.</li>
        <li>Payment and transaction details (if applicable).</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
      <p className="mb-2">Your data is used for the following purposes:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Scheduling and managing doctor appointments.</li>
        <li>Providing personalized healthcare services.</li>
        <li>Processing payments and maintaining records.</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-4">3. Data Protection</h2>
      <p className="mb-4">We implement security measures to ensure that your personal data remains protected. We do not share your information with third parties unless required by law.</p>
      
      <h2 className="text-xl font-semibold mt-4">4. Your Rights</h2>
      <p className="mb-4">You have the right to access, update, or delete your personal information. Contact us at <strong>support@vkhospital.com</strong> for any privacy-related inquiries.</p>
      
      <h2 className="text-xl font-semibold mt-4">5. Changes to Privacy Policy</h2>
      <p className="mb-4">VK Hospital reserves the right to update this Privacy Policy. Any changes will be reflected on this page.</p>
      
      <p className="text-center mt-6">For any concerns, contact us at <strong>support@vkhospital.com</strong>.</p>
    </div>
  );
};

export default Privacy;