import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";
const Layout = (props) => {
  return (
    <div className={classes.app}>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
};

export default Layout;
