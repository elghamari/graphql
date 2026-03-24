export function getRank(level) {
  switch (true) {
    case level >= 0 && level < 10:
      return "Aspiring developer";
    case level >= 10 && level < 20:
      return "Beginner developer";
    case level >= 20 && level < 30:
      return "Apprentice developer";
    case level >= 30 && level < 40:
      return "Assistant developer";
    case level >= 40 && level < 50:
      return "Basic developer";
    case level >= 50 && level < 55:
      return "Junior developer";
    case level >= 55 && level < 60:
      return "Confirmed developer";
    case level === 60:
      return "Full-Stack developer";
    default:
      return "";
  }
}
