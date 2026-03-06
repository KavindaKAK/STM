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

                {/* User Ratings */}
                <div className="mt-12">
                    <h2 className="text-center text-sm font-semibold text-gray-400 mb-4">USER RATINGS</h2>

                    <div className="bg-gray-900 rounded-2xl p-4">
                        <div className="bg-gray-800 rounded-lg p-5">
                            <div className="flex items-center mb-6">
                                <div className="inline-flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-pink-400">❤</div>
                                    <div className="text-sm text-gray-300 font-semibold">RATING</div>
                                </div>
                            </div>

                            <div className="flex items-end gap-6">
                                {/* Love */}
                                <div className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-2xl text-gray-300 mb-2">😍</div>
                                        <div className="text-xs text-gray-400 mb-2">love</div>
                                        <div className="w-full px-4">
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-2 bg-pink-500 rounded-full" style={{ width: '72%' }} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-pink-400 font-semibold mt-2">2.5k</div>
                                    </div>
                                </div>

                                {/* Like */}
                                <div className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-2xl text-gray-300 mb-2">😊</div>
                                        <div className="text-xs text-gray-400 mb-2">like</div>
                                        <div className="w-full px-4">
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-2 bg-pink-300 rounded-full" style={{ width: '32%' }} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-pink-300 font-semibold mt-2">1.1k</div>
                                    </div>
                                </div>

                                {/* Ok */}
                                <div className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-2xl text-gray-300 mb-2">😐</div>
                                        <div className="text-xs text-gray-400 mb-2">ok</div>
                                        <div className="w-full px-4">
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-2 bg-orange-400 rounded-full" style={{ width: '6%' }} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-orange-300 font-semibold mt-2">268</div>
                                    </div>
                                </div>

                                {/* Dislike */}
                                <div className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-2xl text-gray-300 mb-2">☹️</div>
                                        <div className="text-xs text-gray-400 mb-2">dislike</div>
                                        <div className="w-full px-4">
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-2 bg-blue-400 rounded-full" style={{ width: '12%' }} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-blue-300 font-semibold mt-2">103</div>
                                    </div>
                                </div>

                                {/* Hate */}
                                <div className="flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-2xl text-gray-300 mb-2">😡</div>
                                        <div className="text-xs text-gray-400 mb-2">hate</div>
                                        <div className="w-full px-4">
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-2 bg-gray-600 rounded-full" style={{ width: '8%' }} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400 font-semibold mt-2">71</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
