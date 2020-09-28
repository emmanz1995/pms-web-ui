export const authHeader = () => {
  // return authorization header with access token
  // code based on https://www.apollographql.com/docs/react/networking/authentication/
  const token = localStorage.getItem("token");
  if (token) {
     let data = JSON.parse(token);
    return { Authorization: `Bearer ${data.access_token}` };
  } else {
    return {};
  }
}
