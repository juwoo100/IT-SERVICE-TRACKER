export default function Head() {
    return (
        <header className="bg-amber-100 shadow-md fixed top-0 left-0 w-full z-50">
            <nav className="container mx-auto flex justify-between items-center px-6 py-3">
                <h3 className="text-2xl font-bold text-gray-800">IT SERVICE TRACKER</h3>
                <div className="space-x-4 text-gray-700 font-medium">
                    <a href="/dashboard" className="hover:text-amber-600 transition">Dashboard</a>
                    <a href="/new" className="hover:text-amber-600 transition">Add Ticket</a>
                    <a href="/login" className="hover:text-amber-600 transition">Login/Sign up</a>
                </div>
            </nav>
        </header>
    );
}