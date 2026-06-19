import { Lock } from "lucide-react";
import { useEffect, useState } from "react";


export default function OtpPage({ otp, setOtp, handleResendOtp }) {
    const [timeLeft, setTimeLeft] = useState(60)

    useEffect(() => {
        if (timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timeLeft])
    const handleResend = () => {
        handleResendOtp();
        setTimeLeft(60)
    }
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
                OTP
            </label>
            <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                    className="input input-bordered w-full pl-10 focus:input-primary"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
            </div>
            <div className="flex justify-between">
                <p className="text-sm text-gray-500">Resend OTP in {timeLeft}</p>
                <button
                    onClick={handleResend}
                    disabled={timeLeft > 0}
                    type="button"
                    className={`font-medium hover:text-blue-600 ${timeLeft > 0 ? 'opacity-50' : 'text-primary'}`}
                >
                    Resend OTP
                </button>

            </div>

        </div>
    )
}