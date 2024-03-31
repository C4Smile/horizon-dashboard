const {
  VITE_API_URL,
  VITE_THIS_URL,
  // cookies
  VITE_LANGUAGE,
  VITE_BASIC_KEY,
  VITE_ACCEPT_COOKIE,
  VITE_DECLINE_COOKIE,
  VITE_REMEMBER,
  VITE_USER,
  VITE_VALIDATION_COOKIE,
  VITE_RECOVERING_COOKIE,
  // COMMUNICATION
  VITE_CRYPTO,
} = import.meta.env;

const config = {
  apiUrl: VITE_API_URL,
  thisUrl: VITE_THIS_URL,
  // cookie
  language: VITE_LANGUAGE,
  basicKey: VITE_BASIC_KEY,
  accept: VITE_ACCEPT_COOKIE,
  decline: VITE_DECLINE_COOKIE,
  remember: VITE_REMEMBER,
  user: VITE_USER,
  validating: VITE_VALIDATION_COOKIE,
  recovering: VITE_RECOVERING_COOKIE,
  // COMMUNICATION
  crypto: VITE_CRYPTO,
};

export default config;
