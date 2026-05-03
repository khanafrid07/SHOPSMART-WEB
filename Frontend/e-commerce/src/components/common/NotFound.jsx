import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="mt-4 text-gray-500">Page not found</p>
            <Link to={'/'}>

                <button
                    className="mt-6 px-4 py-2 bg-black text-white rounded"
                >
                    Go Home
                </button>
            </Link>
        </div>
    );
}