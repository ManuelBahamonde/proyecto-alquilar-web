// import React from "react";
// import { Oval } from "react-loader-spinner";

// const LoadingSpinner = ({ className }) => {
//     return (
//         <Oval wrapperClass={className} color="#0d6efd" secondaryColor="#0d6efd" width={80} height={80} />
//     )
// };

// export default LoadingSpinner;

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return <div className={classes.spinner}></div>;
}

export default LoadingSpinner;
