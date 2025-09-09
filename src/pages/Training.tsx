import { Helmet } from 'react-helmet-async';

export default function Training() {
  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Training - SnapTechFix</title>
        <meta name="description" content="Learn mobile device repair skills with our professional training courses." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Training Courses</h1>
          <p className="text-xl text-gray-600">Start your journey in device repair</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Coming Soon</h3>
            <p className="text-blue-700">Professional mobile repair training courses will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
