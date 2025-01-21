export const formatTimestamps = (schema) => {
  schema.add({
    createdAt: { type: String },
    updatedAt: { type: String },
  });

  schema.pre("save", function (next) {
    this.createdAt = formatDate(this.createdAt);
    this.updatedAt = formatDate(this.updatedAt);
    next();
  });

  schema.pre("findOneAndUpdate", function (next) {
    this._update.updatedAt = formatDate(new Date());
    next();
  });

  function formatDate(date) {
    const d = new Date(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${month} ${day}, ${year} ${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds} ${ampm}`;
  }
};
