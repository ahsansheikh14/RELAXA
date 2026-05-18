/** Turn full reset URL into an in-app router path for SPA navigation. */
export const toResetPasswordPath = (resetLink) => {
  if (!resetLink) {
    return '/reset-password';
  }

  try {
    const url = new URL(resetLink, window.location.origin);
    return `${url.pathname}${url.search}`;
  } catch {
    return resetLink.startsWith('/') ? resetLink : `/reset-password`;
  }
};
