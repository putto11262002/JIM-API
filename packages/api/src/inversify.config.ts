export const TYPES = {
    // Staff related classes
    STAFF_SERVICE: Symbol.for("StaffService"),
    STAFF_CONTROLLER: Symbol.for("StaffController"),
    STAFF_ROUTER: Symbol.for("StaffRouter"),

    // Model relate classes
    MODEL_SERVICE: Symbol.for("ModelService"),
    MODEL_CONTROLLER: Symbol.for("ModelController"),
    MODEL_ROUTER: Symbol.for("ModelRouter"),

    // Auth related classes
    AUTH_SERVICE: Symbol.for("AuthService"),

    // Email related classes
    EMAIL_SERVICE: Symbol.for("EmailService"),

    MODEL_APPLICATION_SERVICE: Symbol.for("ModelApplicationService"),
    MODEL_APPLICATION_CONTROLLER: Symbol.for("ModelApplicationController"),
    MODEL_APPLICATION_ROUTER: Symbol.for("ModelApplicationRouter"),


    // File related classes
    FILE_SERVICE: Symbol.for("LocalFileService"),
    FILE_SERVICE_FACTORY: Symbol.for("FileService"),
    LOCAL_FILE_SERVICE: Symbol.for("LocalFileService"),

    // Application levels clases
    PRISMA: Symbol.for("Prisma"),
    ROOT_ROUTER: Symbol.for("RootRouter"),
    CONFIG: Symbol.for("Config"),
    APP: Symbol.for("App"),
    LOGGER: Symbol.for("Logger"),
    AUTH_MIDDLEWARE: Symbol.for("AuthMiddleware"),
};
