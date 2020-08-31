import { authService } from "../Service/api/AuthService";

const UNEXPECTED_ERROR_MESSAGE = "Unable to process or fetch details. Please contact pms.badboysdev@gmail.com"

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
  switch (response.status) {
    case 401:
    case 403:      
      error = handleAuthErrorResponse(data);
      break;
    case 400:
    case 404:
    case 500: 
      error = handleDefaultErrorResponse(data);
      break;
    case 200:
    case 201:
    case 204:
      error = null;
      break;
    default:
      error = UNEXPECTED_ERROR_MESSAGE;
      break;
  }

  console.log({ error });
  if (error) {
    return Promise.reject(error)
  }

  return data;
}

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
