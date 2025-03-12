import axios from "axios";
import dotenv from "dotenv";
import ErrorHandler from "./error.js";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    // Envoie le cookie au user-service pour vérification
    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/getuser`,
      {
        headers: {
          Cookie: req.headers.cookie, // Transmet le cookie du client
        },
        withCredentials: true, // Permet d'envoyer les cookies
      }
    );

    req.user = response.data.user; // Ajoute l'utilisateur à req
    next();
  } catch (error) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return next(new ErrorHandler("Access denied: Admins only", 403));
  }
  next();
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `${req.user?.role} not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
