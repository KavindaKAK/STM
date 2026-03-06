export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Welcome to Tyre Shop Beruwala</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We are a leading provider of premium tyres, batteries, and auto accessories in Beruwala, Sri Lanka.
                            With years of experience in the automotive industry, we pride ourselves on offering top-quality products
                            and exceptional customer service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To provide our customers with the best automotive products at competitive prices, backed by expert
                            advice and reliable service. We are committed to ensuring your vehicle runs safely and efficiently.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-primary-900 mr-2">✓</span>
                                <span>Premium quality products from trusted brands</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-900 mr-2">✓</span>
                                <span>Island-wide delivery to all 25 districts</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-900 mr-2">✓</span>
                                <span>Competitive pricing and regular promotions</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-900 mr-2">✓</span>
                                <span>Expert guidance and customer support</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-primary-900 mr-2">✓</span>
                                <span>Cash on Delivery for your convenience</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-4xl mb-2">🛞</div>
                                <h3 className="font-semibold mb-1">Tyres</h3>
                                <p className="text-sm text-gray-600">For cars, vans, SUVs, and motorcycles</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-4xl mb-2">🔋</div>
                                <h3 className="font-semibold mb-1">Batteries</h3>
                                <p className="text-sm text-gray-600">High-quality automotive batteries</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-4xl mb-2">🔧</div>
                                <h3 className="font-semibold mb-1">Accessories</h3>
                                <p className="text-sm text-gray-600">Complete range of auto parts</p>
                            </div>
                        </div>
                    </section>

                    <section className="border-t pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Visit Our Store</h2>
                        <p className="text-gray-700">
                            <strong>Address:</strong> Beruwala, Sri Lanka<br />
                            <strong>Phone:</strong> +94 77 123 4567<br />
                            <strong>Email:</strong> support@tyreshop.lk<br />
                            <strong>Hours:</strong> Monday - Saturday, 8:00 AM - 6:00 PM
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
