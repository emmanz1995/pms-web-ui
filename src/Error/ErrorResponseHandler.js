import { authService } from "../Service/api/AuthService";

// setting an error message for when an fetch error occurs in server
const UNEXPECTED_ERROR_MESSAGE = "Unable to process or fetch details. Please contact pms.badboysdev@gmail.com"

// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
export const errorResponseHandler = (response) => {
  switch (response.headers.get('content-type')) {
    case "application/octet-stream":
      return handleErrorResponse(response, response.blob());
    default:
      return response.text().then(text => {
        const data = text && JSON.parse(text);
        return handleErrorResponse(response, data);
      });
  }
}

const handleErrorResponse = (response, data) => {
  console.log(`Handling Response: ${response} with Status: ${response.status}`);
  let error = null;
  // switches depending on the type of error that occurs
  switch (response.status) {
    case 401: // case for Unauthorized error
    case 403: // case for Forbidden error
      error = handleAuthErrorResponse(data);
      break;
    case 400: // case for Bad Request error
    case 404: // case for Not Found error
    case 500: // case for Internal Server Error
      error = handleDefaultErrorResponse(data);
      break;
    case 200: // case for ok status
    case 201: // case for created status
    case 204: // case for no content
      error = null;
      break;
    default:
      error = UNEXPECTED_ERROR_MESSAGE;
      break;
  }

  console.log({ error }); // logs error to console
  if (error) {
    return Promise.reject(error)
  }

  return data;
}

// code based on https://stackoverflow.com/questions/47216452/how-to-handle-401-authentication-error-in-axios-and-react
const handleAuthErrorResponse = (data) => {
  authService.onLogout().catch(x => x);
  window.location.reload(true);
  return (data && data.message) ||
  (data && data.error) ||
  UNEXPECTED_ERROR_MESSAGE;
}

const handleDefaultErrorResponse = (data) => {
  return data && data.errors && data.errors.map(error => error.error).join() || 
  data && data.error_description ||
  data && data.message ||
  UNEXPECTED_ERROR_MESSAGE;
}
