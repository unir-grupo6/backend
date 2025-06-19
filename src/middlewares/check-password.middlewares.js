const passwordValidator = (password) => {
  const minLength  = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasDigits = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength ) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!hasUpperCase.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!hasLowerCase.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!hasDigits.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!hasSpecialChar.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  return { valid: true };
};

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  const validated = passwordValidator(password);

  if (!validated.valid) {
    return res.status(400).json({ message: validated.message });
  }

  next();
};

module.exports = {
  checkPassword
};