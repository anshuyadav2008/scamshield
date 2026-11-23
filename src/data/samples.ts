export const SCAN_SAMPLES = [
  {
    name: "Prize claim",
    text: "Congratulations! You have won a prize. Pay a processing fee immediately and enter your bank details to claim your reward.",
  },
  {
    name: "Bank KYC alert",
    text: "URGENT: Your bank account will be blocked today. Click the link https://bit.ly/kyc-check to update your KYC immediately.",
  },
  {
    name: "OTP request",
    text: "Your delivery is on hold. Share your OTP now to confirm the address and release the parcel.",
  },
  {
    name: "Job offer",
    text: "Congratulations, your job is confirmed. Pay a registration fee today to secure your position. Keep this confidential.",
  },
  {
    name: "Personal conversation",
    text: "Hey! Are we still meeting for lunch tomorrow? I can bring coffee if you like.",
  },
  {
    name: "Safety warning",
    text: "Reminder: Never share your OTP, UPI PIN, or password with anyone. A real bank will not ask for these details over a message.",
  },
];

export interface QuizQuestion {
  message: string;
  suspicious: boolean;
  explanation: string;
  label: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { message: "Your parcel is delayed. Track it in the official courier app you already use.", suspicious: false, explanation: "This message asks you to use an app you already trust and does not ask for secrets or payment.", label: "Delivery update" },
  { message: "Your account will be blocked in 10 minutes. Click this shortened link and enter your OTP.", suspicious: true, explanation: "Urgency, a shortened link, a threat, and an OTP request are strong warning signs.", label: "Urgent bank alert" },
  { message: "Never share your OTP with anyone, even if they claim to be from your bank.", suspicious: false, explanation: "This is a safety warning. It advises against sharing secrets rather than asking you to share them.", label: "Safety reminder" },
  { message: "Congratulations! You won a lottery you never entered. Pay a fee to claim your prize.", suspicious: true, explanation: "An unexpected prize paired with an upfront fee is a common scam pattern.", label: "Unexpected prize" },
  { message: "I'll send the UPI payment after we meet. No need to share your PIN.", suspicious: false, explanation: "The message does not request credentials or payment in advance; it explicitly says not to share the PIN.", label: "Personal message" },
  { message: "Job confirmed! Pay a registration fee today and install this APK to begin onboarding.", suspicious: true, explanation: "An upfront fee and an unsolicited APK installation request deserve independent verification.", label: "Job offer" },
  { message: "Your monthly statement is ready in the official banking app. Open the app directly to view it.", suspicious: false, explanation: "It recommends opening the official app directly rather than following an embedded link.", label: "Statement notice" },
  { message: "Aapka bijli connection aaj kat jayega. KYC update karne ke liye link par click karein.", suspicious: true, explanation: "A disconnection threat and a pressured link request are concerning. Verify through your utility's official channel.", label: "Hinglish utility threat" },
  { message: "The bank's public website explains how to report a lost card. I can send you the official homepage.", suspicious: false, explanation: "A reference to a bank is not itself suspicious; this message offers public information without pressure or secret requests.", label: "Helpful information" },
  { message: "Please send your CVV and one-time password to verify a refund. Keep this secret.", suspicious: true, explanation: "A request for CVV and OTP plus secrecy is highly concerning. Never disclose those details.", label: "Refund verification" },
];
