import { Suspense } from "react"
import ResetPasswordForm from "./reset-password-form"

const ResetPasswordPage=()=>{
    return (
        <div>
            <h2 className="text-center text-xl p-3">Reset Password</h2>
            <Suspense fallback="loading...">
                <ResetPasswordForm></ResetPasswordForm>
            </Suspense>
        </div>
    )
}

export default ResetPasswordPage;