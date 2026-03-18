export const formatDate = (localDate: string) => {
  const date = new Date(localDate);
  return {
    dayOfMonth: date.getDate(),
    dayOfWeek: date.toLocaleDateString("en-GB", { weekday: "long" }),
    dayOfWeekShort: date.toLocaleDateString("en-GB", { weekday: "short" }),
    monthName: date.toLocaleDateString("en-GB", { month: "short" }),
    fullLabel: date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
  };
};
