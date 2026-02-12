export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <span className="text-2xl mr-2">📍</span> Address
                                </h3>
                                <p className="text-gray-700 ml-8">
                                    Tyre Shop Beruwala<br />
                                    Beruwala, Sri Lanka
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <span className="text-2xl mr-2">📱</span> Phone
                                </h3>
                                <p className="text-gray-700 ml-8">
                                    <a href="tel:+94771234567" className="text-primary-900 hover:underline">
                                        +94 77 123 4567
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <span className="text-2xl mr-2">📧</span> Email
                                </h3>
                                <p className="text-gray-700 ml-8">
                                    <a href="mailto:support@tyreshop.lk" className="text-primary-900 hover:underline">
                                        support@tyreshop.lk
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <span className="text-2xl mr-2">💬</span> WhatsApp
                                </h3>
                                <p className="text-gray-700 ml-8">
                                    <a
                                        href="https://wa.me/94771234567"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-900 hover:underline"
                                    >
                                        Chat with us on WhatsApp
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 flex items-center">
                                    <span className="text-2xl mr-2">🕐</span> Business Hours
                                </h3>
                                <p className="text-gray-700 ml-8">
                                    Monday - Saturday: 8:00 AM - 6:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 font-medium"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
