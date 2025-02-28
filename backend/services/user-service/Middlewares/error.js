class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Par défaut : erreur serveur 500
  err.message = err.message || "Internal server error."; // Message par défaut

  //  Gestion des erreurs spécifiques
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`; // Exemple : Mauvais format d'ID MongoDB
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`; // Clé unique MongoDB dupliquée
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again.`; // JWT invalide
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again.`; // JWT expiré
    err = new ErrorHandler(message, 400);
  }

  // Réponse JSON propre
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
