import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-300 to-yellow-300 text-black-300">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Store Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Garissa Store</h3>
            <p className="text-xs">
              Quality products at affordable prices since 2020.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-white mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-md font-semibold text-white mb-2">Help</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-md font-semibold text-white mb-2">Contact</h4>
            <address className="not-italic space-y-2 text-sm">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-0.5 mr-1.5 flex-shrink-0 text-sm" />
                <span>Garissa Business Ave, Garissa</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-1.5 text-sm" />
                <span>+254 729478860</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-1.5 text-sm" />
                <span>abdikafimohamud126@gmail.com</span>
              </div>
            </address>
          </div>
        </div>



        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs text-white-500">
          <p>
            &copy; {new Date().getFullYear()} Garissa Store | 
            <Link to="#" className="hover:text-white ml-1">Privacy</Link> | 
            <Link to="#" className="hover:text-white ml-1">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;