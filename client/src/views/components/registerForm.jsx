import classes from "./css/registerform.module.css";

const RegisterForm = ({ submitHandler, formValues, changeHandler, button }) => {
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <h1>Register</h1>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        required
        id="email"
        name="email"
        value={formValues.email ?? ""}
        onChange={changeHandler}
      />
      <label htmlFor="username">Username</label>
      <input
        type="text"
        required
        id="username"
        name="username"
        value={formValues.username ?? ""}
        onChange={changeHandler}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        required
        id="password"
        name="password"
        value={formValues.password ?? ""}
        onChange={changeHandler}
      />
      <button type="submit">Submit</button>
      {button && button}
    </form>
  );
};

export default RegisterForm;
