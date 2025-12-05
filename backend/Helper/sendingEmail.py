import os
from dotenv import load_dotenv
import smtplib

# --- 1. Load the Environment Variables ---
# This line reads the .env file and makes the variables available
load_dotenv() 

# --- 2. Retrieve Secrets Safely ---
# Retrieve and store secrets once at the script level
SENDER_EMAIL = os.getenv('SENDER_EMAIL')
APP_PASSWORD = os.getenv('APP_PASSWORD')

# Safety Check (recommended)
if not SENDER_EMAIL or not APP_PASSWORD:
    print("Error: Missing SENDER_EMAIL or APP_PASSWORD in .env file.")
    # Exiting here prevents the script from attempting to run the function
    exit() 

# --- 3. Define the Function to Send the Mail ---
def sendMail(receiver_email: str,subject : str, message: str):
    """
    Connects to the SMTP server, logs in, and sends an email.
    
    Args:
        receiver_email (str): The email address of the recipient.
        subject (str): The subject line of the email.
        message (str): The body content of the email.
    """
    
    # Format the content string correctly (Header: \n\nBody)
    email_content = f"Subject: {subject}\n\n{message}"

    try:
        # Connect to the SMTP server on port 587
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() # Secure the connection
        
        # Login using the secure variables retrieved earlier
        server.login(SENDER_EMAIL, APP_PASSWORD) 
        
        # Send the email
        server.sendmail(SENDER_EMAIL, receiver_email, email_content)
        server.quit()
        
        return(f"Email sent successfully to {receiver_email}!")

    except Exception as e:
        print(f"An error occurred while sending email: {e}")
