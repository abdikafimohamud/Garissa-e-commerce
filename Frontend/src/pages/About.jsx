const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-6">About Garissa Store</h1>
        <p className="text-lg text-gray-600 mb-8">
        Garissa Store began its journey in 2025 with a simple vision - to create an online shopping experience that combines quality, affordability, and convenience. 
  What started as a small digital storefront has grown into Garissa trusted destination for fashion, beauty essentials, and the latest technology. 
  We take pride in carefully selecting each product in our collection, working closely with local makers and trusted suppliers to ensure everything we offer meets our high standards. 
  Our commitment goes beyond just selling products - we're building a shopping community that values honest prices, reliable service, and supporting Kenyan businesses. 
  Whether you're updating your wardrobe, refreshing your beauty routine, or upgrading your tech, we're here to make your shopping experience enjoyable and worthwhile.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">Our Mission</h2>
      <div className="flex flex-col md:flex-row gap-8">
  {/* Left Mission Statement */}
  <div className="md:w-1/2">
    <p className="text-gray-700">
      We believe everyone deserves great products<br />
      At prices that make sense for real people<br />
      We connect our community with quality items<br />
      Without cutting corners or compromising values<br />
      Our business is built on fairness and trust<br />
      With customer service that truly cares<br />
      Because shopping should be easy and honest<br />
      For every member of our community
    </p>
  </div>
  
  {/* Right Mission Statement */} 
  <div className="md:w-1/2">
    <p className="text-gray-700">
      Bringing quality products to our community<br />
      At prices that are fair and honest<br />
      We do business the right way<br />
      With service that goes above and beyond<br />
      Because everyone deserves to shop<br />
      With confidence and peace of mind
    </p>
  </div>
</div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Humble Beginnings</h3>
            <p className="text-gray-600 mb-4">
              What started as a small kiosk in Garissa's central business district has blossomed into a thriving 
              online marketplace serving customers across Kenya. Our founder, Abdikafi Mohamud, began with just 
              a single shelf of mobile accessories and a vision to make technology accessible to everyone.
            </p>
            <p className="text-gray-600">
              Through word-of-mouth recommendations and a relentless focus on customer satisfaction, we gradually 
              expanded our product range to include fashion and beauty products, always maintaining our core 
              principle of value for money.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Growth & Innovation</h3>
            <p className="text-gray-600 mb-4">
              In 2025, we launched our e-commerce platform to better serve customers beyond our physical location. 
              This digital transformation allowed us to expand our product catalog tenfold while maintaining the 
              personal touch our customers love.
            </p>
            <p className="text-gray-600">
              Today, we partner with over 50 local suppliers and several international brands to bring you the 
              best selection of clothing, cosmetics, and electronics in the region.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Garissa Store?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality Assurance</h3>
            <p className="text-gray-600">
              Every product in our inventory undergoes rigorous quality checks. We stand behind everything we sell 
              with a 100% satisfaction guarantee.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Local Expertise</h3>
            <p className="text-gray-600">
              Our team of Kenyan fashion, beauty, and tech experts carefully selects products suited for our 
              climate, culture, and lifestyle needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Community Focus</h3>
            <p className="text-gray-600">
              10% of our profits support education initiatives in Garissa County. When you shop with us, 
              you're investing in Kenya's future.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
        <ul className="space-y-4 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span><strong>Integrity:</strong> Honest pricing and transparent business practices</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span><strong>Innovation:</strong> Constantly improving our services and product offerings</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span><strong>Customer First:</strong> Personalized service and support</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span><strong>Sustainability:</strong> Eco-friendly packaging and responsible sourcing</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;