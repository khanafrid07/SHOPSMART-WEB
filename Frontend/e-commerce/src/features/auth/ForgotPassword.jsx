import { useState } from "react"
import OtpPage from "./OtpPage"
import { forgotPasswordSendOtp, forgotPasswordVerifyOtp } from "./authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { notifyError, notifySuccess } from "../../utils/notify";
export default function ForgotPassword({setSwitchForm}) {
    const dispatch = useDispatch()
    const [step, setStep] = useState("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { loading, error } = useSelector((state) => state.auth)
    const [noMatch, setNoMatch] = useState("")
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        setNoMatch("")
        if (password !== confirmPassword) {
            setNoMatch("Password does not match")
            return
        }
        if (step == "email") {
            try {
                const res = await dispatch(forgotPasswordSendOtp(email)).unwrap()
                console.log(res)
                setStep("otp")
            } catch (error) {
                notifyError(error.message || "Failed to send otp")
                console.log(error)
            }
        } else if (step == "otp") {
            try {
                const res = await dispatch(forgotPasswordVerifyOtp({ email, otp, password: password })).unwrap()
                console.log(res)

                notifySuccess("Password reset successfully")
                window.location.reload()
            } catch (error) {
                notifyError(error.message || "Failed to reset password")
            }
        }
    }
    const handleResendOtp = async () => {
        try {
            const res = await dispatch(forgotPasswordSendOtp(email)).unwrap()
            console.log(res)
            notifySuccess("Otp sent successfully")
        } catch (error) {
            notifyError(error.message || "Failed to resend otp")
            console.log(error)
        }
    }
    return (
        <>
            <div className="p-8 relative flex flex-col items-center gap-2">
                <button className= "btn absolute left-0 top-8 btn-ghost hover:border-none" onClick={() => setSwitchForm("login")}>
                    Back
                </button>
                <div className="flex justify-center items-center gap-2 mb-2 font-bold">
                    <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Shop</span>
                    <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-blue-600">Smart</span>
                </div>
                <h1 className="text-2xl font-bold">Account Recovery</h1>
                {step == "email" ?
                    <div>
                        <p className="">Enter your registered email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter your email" className="input input-bordered border border-gray-300 rounded-lg p-2" />
                    </div>

                    : (
                        <div className="">
                            <label className="label text-sm ">New Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter your password" className="input input-bordered border border-gray-300 rounded-lg p-2" />
                            <label className="label text-sm ">Confirm New Password</label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" placeholder="Enter your password" className="input input-bordered border border-gray-300 rounded-lg p-2" />
                            <OtpPage handleResendOtp={handleResendOtp} setOtp={setOtp} otp={otp} />
                        </div>

                    )
                }
                <button onClick={() => handleSendOtp()} className="btn btn-primary rounded-lg w-full sm:w-[100%] max-w-[24rem]">
                    {step == "email" ? "Send Otp" : "Verify Otp"}
                </button>
                {
                    noMatch && <p className="text-red-500">{noMatch}</p>
                }

            </div>
        </>
    )
}