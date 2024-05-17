const yup = require("yup");

exports.schema = yup.object().shape({
  userName: yup
    .string()
    .required("وارد کردن نام کاربری الزامی میباشد")
    .min(5, "نام کاربری نباید کمتر از 5 کاراکتر باشد")
    .max(20, "نام کاربری نباید بیشتر از 20 کاراکتر باشد")
    .trim("وایت اسپیس نباید داشته باشد"),
  password: yup
    .string()
    .required("وارد کردن رمز کاربری الزامی میباشد")
    .min(8, "رمز کاربری نباید کمتر از 8 کاراکتر باشد")
    .max(30, "رمز کاربری نباید بیشتر از 30 کاراکتر باشد")
    .trim("وایت اسپیس نباید داشته باشد"),
  repeatPass: yup
    .string()
    .required("وارد کردن تکرار پسورد الزامی میباشد")
    .oneOf([yup.ref("password"), null], "تکرار کلمه عبور را صحیح وارد کنید!")
    .trim("وایت اسپیس نباید داشته باشد"),
  email: yup
    .string()
    .required("وارد کردن ایمیل الزامی میباشد")
    .email("لطفا ایمیل را به صورت صحیح وارد نمایید"),
  phoneNumber: yup
    .string()
    .max(15, "شماره تماس نباید بیشتر از 15 رقم باشد")
    .trim("وایت اسپیس نباید داشته باشد"),
  thumbnail: yup.object().shape({
    name: yup.string(),
    size: yup
      .number()
      .max(3000000, "عکس انتخاب شده نباید بیشتر از 3 مگابایت باشد"),
    mimtype: yup
      .mixed()
      .oneOf([
        "image/jpeg",
        "image/png",
        "عکس انتخاب شده باید Png یا jpeg باشد",
      ]),
  }),
});
