const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            About Garissa Store
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Garissa Store began its journey in 2025 with a simple vision - to create an online shopping experience 
            that combines quality, affordability, and convenience. What started as a small digital storefront has 
            grown into Garissa's trusted destination for fashion, beauty essentials, and the latest technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl mb-16">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Our Mission & Vision</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-100">Our Purpose</h3>
                <ul className="space-y-3 text-blue-50">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 mt-1">•</span>
                    <span>Making quality products accessible to everyone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 mt-1">•</span>
                    <span>Building trust through honest business practices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 mt-1">•</span>
                    <span>Supporting local Kenyan businesses and suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 mt-1">•</span>
                    <span>Creating a shopping community built on reliability</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-100">Our Promise</h3>
                <ul className="space-y-3 text-blue-50">
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3 mt-1">•</span>
                    <span>Fair prices that respect your budget</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3 mt-1">•</span>
                    <span>Quality you can trust in every product</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3 mt-1">•</span>
                    <span>Service that goes above and beyond</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-3 mt-1">•</span>
                    <span>Community impact through every purchase</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From humble beginnings to becoming Garissa's trusted shopping destination
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Humble Beginnings</h3>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                What started as a small kiosk in Garissa's central business district has blossomed into a thriving 
                online marketplace serving customers across Kenya. Our founder, Abdikafi Mohamud, began with just 
                a single shelf of mobile accessories and a vision to make technology accessible to everyone.
              </p>
              <p>
                Through word-of-mouth recommendations and a relentless focus on customer satisfaction, we gradually 
                expanded our product range to include fashion and beauty products, always maintaining our core 
                principle of value for money.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Growth & Innovation</h3>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                In 2025, we launched our e-commerce platform to better serve customers beyond our physical location. 
                This digital transformation allowed us to expand our product catalog tenfold while maintaining the 
                personal touch our customers love.
              </p>
              <p>
                Today, we partner with over 50 local suppliers and several international brands to bring you the 
                best selection of clothing, cosmetics, and electronics in the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Garissa Store?</h2>
          <p className="text-xl text-gray-600">Experience the difference that quality and care make</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
            <p className="text-gray-600 leading-relaxed">
              Every product in our inventory undergoes rigorous quality checks. We stand behind everything we sell 
              with a 100% satisfaction guarantee and comprehensive warranty support.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Local Expertise</h3>
            <p className="text-gray-600 leading-relaxed">
              Our team of Kenyan fashion, beauty, and tech experts carefully selects products suited for our 
              climate, culture, and lifestyle needs. We understand what works best for our community.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Community Focus</h3>
            <p className="text-gray-600 leading-relaxed">
              10% of our profits support education initiatives in Garissa County. When you shop with us, 
              you're investing in Kenya's future and empowering local communities.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
                  <p className="text-gray-600">Honest pricing, transparent business practices, and building trust through every interaction.</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">Constantly improving our services, embracing technology, and enhancing customer experience.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start p-4 rounded-2xl bg-green-50 border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer First</h3>
                  <p className="text-gray-600">Personalized service, dedicated support, and putting our customers at the heart of every decision.</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
                  <p className="text-gray-600">Eco-friendly packaging, responsible sourcing, and supporting local environmental initiatives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;