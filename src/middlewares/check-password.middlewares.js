const passwordValidator = (password) => {
  const minLength  = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasDigits = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength ) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (!hasUpperCase.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula.' };
  }
  if (!hasLowerCase.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra minúscula.' };
  }
  if (!hasDigits.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número.' };
  }
  if (!hasSpecialChar.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un carácter especial.' };
  }
  return { valid: true };
};

const checkRegisterPassword = (req, res, next) => {
 const { contraseña } = req.body;

  const validated = passwordValidator(contraseña);

  if (!validated.valid) {
    return res.status(400).json({ message: validated.message });
  }

  next();
};

const checkUpdatePassword = (req, res, next) => {
 const { newPassword } = req.body;

  const validated = passwordValidator(newPassword);

  if (!validated.valid) {
    return res.status(400).json({ message: validated.message });
  }

  next();
};

module.exports = {
    checkRegisterPassword,
    checkUpdatePassword
};