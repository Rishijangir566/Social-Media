import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.BACKEND_URL1}/user/verify/${token}`;
  // console.log(link);
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Verify your Email",
    html: `
      <h3>Email Verification</h3>
      <p>Click the link below to verify your email and complete your registration:</p>
      <a href="${link}">${link}</a>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);
    throw new Error("Failed to send verification email");
  }
};
