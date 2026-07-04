// RFC 5322 compliant email regex pattern
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;

function validateRegister(req, res, next) {
  const { employeeId, email, password, role } = req.body;

  if (!employeeId || typeof employeeId !== 'string' || employeeId.trim() === '') {
    return res.status(400).json({ error: 'Employee ID is required.' });
  }

  if (!email || !RFC5322_EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Entered email is invalid. Must conform to RFC 5322 rules.' });
  }

  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
  }

  if (!role || (role !== 'EMPLOYEE' && role !== 'HR')) {
    return res.status(400).json({ error: 'Role must be either EMPLOYEE or HR.' });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !RFC5322_EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Entered email is invalid.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  RFC5322_EMAIL_REGEX,
  PASSWORD_REGEX
};
