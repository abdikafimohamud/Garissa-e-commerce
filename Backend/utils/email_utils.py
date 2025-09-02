from flask_mail import Message
from app import mail   # <-- import the Flask-Mail instance from your app

def send_welcome_email(user_email, firstname):
    """
    Sends a welcome email to a new user after successful registration.
    """
    try:
        subject = "🎉 Welcome to Our Platform!"
        body = f"""
        Hi {firstname},

        🎉 Welcome to our platform!

        Your account has been created successfully. 
        You can now log in and start enjoying our services.

        Best regards,  
        The Team
        """

        msg = Message(
            subject=subject,
            recipients=[user_email],
            body=body,
            sender="abdikafimohamud126@gmail.com"  # ✅ Gmail sender
        )
        mail.send(msg)
        return True
    except Exception as e:
        print("❌ Email sending failed:", str(e))
        return False
