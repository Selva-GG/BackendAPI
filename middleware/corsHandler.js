import  cors from "cors";

const whiteList = ["https://www.google.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error(" Error spotted"));
    }
  },
  optionSuccessStatus: 200,
};

export default cors(corsOptions);
