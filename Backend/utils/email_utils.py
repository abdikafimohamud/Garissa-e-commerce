# app/utils/email_utils.py
from flask_mail import Message
from app import mail

def send_welcome_email(user_email, firstname):
    """
    Sends a beautiful welcome email to a new user after successful registration.
    Supports both plain text and HTML format.
    """
    try:
        subject = "🎉 Welcome to Our Platform!"
        plain_body = f"""
Hi {firstname},

🎉 Welcome to our platform!

Your account has been created successfully. You can now log in and start enjoying our services.

Best regards,
The Team
        """

        html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #2c3e50;">🎉 Welcome, {firstname}!</h2>
      <p>Thank you for registering with our platform. Your account has been successfully created.</p>
      <p>You can now log in and explore all our amazing features!</p>
      <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Log In Now</a>
      <p style="margin-top: 20px; color: #7f8c8d;">Best regards,<br>The Team</p>
    </div>
  </body>
</html>
        """

        msg = Message(
            subject=subject,
            recipients=[user_email],
            body=plain_body,
            html=html_body,        # ✅ HTML version
            sender="abdikafimohamud126@gmail.com"
        )

        mail.send(msg)
        print(f"✅ Welcome email sent to {user_email}")
        return True

    except Exception as e:
        print(f"❌ Failed to send welcome email to {user_email}: {str(e)}")
        return False
