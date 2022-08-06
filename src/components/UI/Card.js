import classes from './Card.module.css';

const Card = ({ children, className }) => {
  let cardClassName = classes.card;
  
  if (className) cardClassName += ` ${className}`;

  return <div className={cardClassName}>{children}</div>
};

export default Card;