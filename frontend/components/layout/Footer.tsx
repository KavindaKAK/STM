import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Shop Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">🛞 Tyre Shop</h3>
                        <p className="text-sm mb-4">
                            Premium tyres, batteries & accessories in Beruwala, Sri Lanka.
                            Island-wide delivery available.
                        </p>
                        <div className="space-y-2 text-sm">
                            <p>📍 Beruwala, Sri Lanka</p>
                            <p>📧 support@tyreshop.lk</p>
                            <p>📱 +94 77 123 4567</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="hover:text-white">
                                    Customer Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/how-to-buy" className="hover:text-white">
                                    How to Buy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/94771234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white flex items-center space-x-2"
                                >
                                    <span>💬 WhatsApp Support</span>
                                </a>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white">
                                    My Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Shop By Category</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/tyres" className="hover:text-white">
                                    Tyres
                                </Link>
                            </li>
                            <li>
                                <Link href="/batteries" className="hover:text-white">
                                    Batteries
                                </Link>
                            </li>
                            <li>
                                <Link href="/accessories" className="hover:text-white">
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Tyre Shop Beruwala. All rights reserved.</p>
                    <p className="mt-2">Built with ❤️ in Sri Lanka</p>
                </div>
            </div>
        </footer>
    );
}
