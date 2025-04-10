const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
        <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
            />
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4.293 6.293a1 1 0 011.414 0L12 12.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
            />
        </svg>
        </div>
    );
}
export default LoadingSpinner;