import bcrypt
from typing import Optional

def encrypt_password(password: str) -> Optional[bytes]:
    """
    Hashes a plaintext password using bcrypt with a cost factor (rounds) of 14.
    Returns the complete hash (including salt and cost factor) as bytes.
    
    :param password: The plaintext password string.
    :return: The bcrypt hash as bytes, or None if input is empty or hashing fails.
    """
    if not password:
        return None
    
    try:
        byte_password = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=14)
        hashed_password = bcrypt.hashpw(byte_password, salt)
        return hashed_password
    except Exception as e:
        # Log this error in production
        return None

def verifypassword(plain_password: str, hashed_password: bytes) -> bool:
    """
    Verifies a plaintext password against a stored bcrypt hash.
    
    :param plain_password: The plaintext password entered by the user.
    :param hashed_password: The stored bcrypt hash (which contains the original salt).
    :return: True if the passwords match, False otherwise.
    """
    if not plain_password or not hashed_password:
        return False
    
    try:
        byte_password = plain_password.encode('utf-8')
        # hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(byte_password, hashed_password)
    except (ValueError, TypeError):
        # Invalid hash format or corrupted data
        return False